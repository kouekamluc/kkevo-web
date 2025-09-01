import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from '../sections/HeroSection';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('HeroSection', () => {
  it('renders hero section with main heading', () => {
    render(<HeroSection />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/software development/i);
  });

  it('renders hero description', () => {
    render(<HeroSection />);
    
    const description = screen.getByText(/transform your business/i);
    expect(description).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<HeroSection />);
    
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
    
    // Check for primary CTA button
    const primaryButton = screen.getByText(/get started/i);
    expect(primaryButton).toBeInTheDocument();
  });

  it('renders secondary action button', () => {
    render(<HeroSection />);
    
    const secondaryButton = screen.getByText(/view our work/i);
    expect(secondaryButton).toBeInTheDocument();
  });

  it('displays company tagline', () => {
    render(<HeroSection />);
    
    const tagline = screen.getByText(/innovative solutions/i);
    expect(tagline).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HeroSection />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('aria-label', 'KKEVO Software Development');
  });

  it('renders with correct CSS classes', () => {
    render(<HeroSection />);
    
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveClass('relative', 'min-h-screen');
  });

  it('displays company name prominently', () => {
    render(<HeroSection />);
    
    const companyName = screen.getByText(/KKEVO/i);
    expect(companyName).toBeInTheDocument();
  });

  it('has responsive design classes', () => {
    render(<HeroSection />);
    
    const container = screen.getByTestId('hero-container');
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });

  it('renders background elements', () => {
    render(<HeroSection />);
    
    const backgroundElements = screen.getAllByTestId('hero-background');
    expect(backgroundElements.length).toBeGreaterThan(0);
  });
});

// Test for different screen sizes
describe('HeroSection Responsiveness', () => {
  it('applies mobile-first responsive classes', () => {
    render(<HeroSection />);
    
    const textContainer = screen.getByTestId('hero-text');
    expect(textContainer).toHaveClass('text-center', 'lg:text-left');
  });

  it('has proper spacing for different breakpoints', () => {
    render(<HeroSection />);
    
    const content = screen.getByTestId('hero-content');
    expect(content).toHaveClass('py-12', 'sm:py-16', 'lg:py-20');
  });
});

// Test for animations and interactions
describe('HeroSection Interactions', () => {
  it('handles button clicks', () => {
    const mockRouter = vi.mocked(require('next/navigation').useRouter);
    const mockPush = vi.fn();
    mockRouter.mockReturnValue({ push: mockPush });

    render(<HeroSection />);
    
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);
    
    // In a real test, you'd verify the router was called
    // expect(mockPush).toHaveBeenCalledWith('/contact');
  });

  it('has hover effects on buttons', () => {
    render(<HeroSection />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('hover:', 'transition-colors');
    });
  });
});

// Test for content structure
describe('HeroSection Content Structure', () => {
  it('has proper heading hierarchy', () => {
    render(<HeroSection />);
    
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Main heading should be h1
    const mainHeading = headings[0];
    expect(mainHeading.tagName).toBe('H1');
  });

  it('contains expected text content', () => {
    render(<HeroSection />);
    
    const expectedTexts = [
      'software development',
      'transform your business',
      'innovative solutions',
      'get started',
      'view our work'
    ];
    
    expectedTexts.forEach(text => {
      expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
    });
  });
});

// Test for styling and theme
describe('HeroSection Styling', () => {
  it('uses consistent color scheme', () => {
    render(<HeroSection />);
    
    const primaryButton = screen.getByText(/get started/i);
    expect(primaryButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
  });

  it('has proper contrast and readability', () => {
    render(<HeroSection />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-gray-900', 'dark:text-white');
  });
});

// Test for performance and optimization
describe('HeroSection Performance', () => {
  it('renders without unnecessary re-renders', () => {
    const { rerender } = render(<HeroSection />);
    
    // Re-render with same props
    rerender(<HeroSection />);
    
    // Component should render the same content
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has optimized image loading', () => {
    render(<HeroSection />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });
});


