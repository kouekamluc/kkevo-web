import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AdminBlogDashboard from '../AdminBlogDashboard';
import { blogApi } from '@/lib/api';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API
jest.mock('@/lib/api', () => ({
  blogApi: {
    getAll: jest.fn(),
    getCategories: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

// Mock components
jest.mock('@/components/ui', () => ({
  AnimatedCard: ({ children, className }: any) => (
    <div className={className} data-testid="animated-card">
      {children}
    </div>
  ),
  AnimatedButton: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className} data-testid="animated-button">
      {children}
    </button>
  ),
  Skeleton: ({ className }: any) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

jest.mock('@/components/animations', () => ({
  FadeInSection: ({ children }: any) => <div data-testid="fade-in">{children}</div>,
  StaggerList: ({ children }: any) => <div data-testid="stagger-list">{children}</div>,
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    excerpt: 'Test excerpt 1',
    content: 'Test content 1',
    author: { id: '1', name: 'Test Author', role: 'Developer' },
    category: { id: '1', name: 'Technology', slug: 'technology', color: '#3B82F6' },
    status: 'published',
    is_featured: true,
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    estimated_reading_time: 5,
    word_count: 1000,
    view_count: 100,
    like_count: 10,
    bookmark_count: 5,
    share_count: 2,
    comment_count: 3,
    published_at: '2024-01-01T00:00:00Z',
  },
];

const mockCategories = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    color: '#3B82F6',
    description: 'Tech insights',
    order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

describe('AdminBlogDashboard', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (blogApi.getAll as jest.Mock).mockResolvedValue({
      data: { results: mockPosts },
    });
    (blogApi.getCategories as jest.Mock).mockResolvedValue({
      data: { results: mockCategories },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with stats', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Blog Management')).toBeInTheDocument();
      expect(screen.getByText('Total Posts')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Total posts count
    });
  });

  it('displays blog posts table', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search posts...');
      fireEvent.change(searchInput, { target: { value: 'Test' } });
      
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });

  it('handles status filtering', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const statusFilter = screen.getByDisplayValue('All Status');
      fireEvent.change(statusFilter, { target: { value: 'published' } });
      
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });

  it('navigates to new post page', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const newPostButton = screen.getByText('New Post');
      fireEvent.click(newPostButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/blog/new');
    });
  });

  it('navigates to categories page', async () => {
    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const categoriesButton = screen.getByText('Categories');
      fireEvent.click(categoriesButton);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/blog/categories');
    });
  });

  it('handles post deletion', async () => {
    (blogApi.delete as jest.Mock).mockResolvedValue({});
    
    // Mock confirm dialog
    global.confirm = jest.fn(() => true);

    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId('animated-button');
      fireEvent.click(deleteButton);
      
      expect(global.confirm).toHaveBeenCalled();
      expect(blogApi.delete).toHaveBeenCalledWith('1');
    });
  });

  it('handles post status toggle', async () => {
    (blogApi.update as jest.Mock).mockResolvedValue({});

    render(<AdminBlogDashboard />);

    await waitFor(() => {
      const toggleButton = screen.getByTestId('animated-button');
      fireEvent.click(toggleButton);
      
      expect(blogApi.update).toHaveBeenCalledWith('1', { status: 'draft' });
    });
  });

  it('shows loading state initially', () => {
    render(<AdminBlogDashboard />);
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('displays empty state when no posts', async () => {
    (blogApi.getAll as jest.Mock).mockResolvedValue({
      data: { results: [] },
    });

    render(<AdminBlogDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
      expect(screen.getByText('Create First Post')).toBeInTheDocument();
    });
  });
});







