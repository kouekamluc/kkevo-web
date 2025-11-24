import { blogApi } from '@/lib/api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('Blog API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should call blog list endpoint with correct parameters', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { results: [], count: 0 } };
      mockAxios.get.mockResolvedValue(mockResponse);

      const params = {
        page: 1,
        page_size: 10,
        category: 'tech',
        published_only: true
      };

      await blogApi.getAll(params);

      expect(mockAxios.get).toHaveBeenCalledWith('/blog/', { params });
    });

    it('should handle empty parameters', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { results: [], count: 0 } };
      mockAxios.get.mockResolvedValue(mockResponse);

      await blogApi.getAll();

      expect(mockAxios.get).toHaveBeenCalledWith('/blog/', { params: { published_only: false } });
    });
  });

  describe('getBySlug', () => {
    it('should call blog detail endpoint with slug', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { id: '1', title: 'Test Post' } };
      mockAxios.get.mockResolvedValue(mockResponse);

      const slug = 'test-post';
      await blogApi.getBySlug(slug);

      expect(mockAxios.get).toHaveBeenCalledWith(`/blog/${slug}/`);
    });
  });

  describe('search', () => {
    it('should call search endpoint with query', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { results: [], count: 0 } };
      mockAxios.get.mockResolvedValue(mockResponse);

      const query = 'react development';
      await blogApi.search(query);

      expect(mockAxios.get).toHaveBeenCalledWith('/blog/', { 
        params: { search: query, published_only: false } 
      });
    });
  });

  describe('create', () => {
    it('should call create endpoint with post data', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { id: '1', title: 'New Post' } };
      mockAxios.post.mockResolvedValue(mockResponse);

      const postData = {
        title: 'New Post',
        content: 'Post content',
        excerpt: 'Post excerpt'
      };

      await blogApi.create(postData);

      expect(mockAxios.post).toHaveBeenCalledWith('/blog/', postData);
    });
  });

  describe('update', () => {
    it('should call update endpoint with post data', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { id: '1', title: 'Updated Post' } };
      mockAxios.patch.mockResolvedValue(mockResponse);

      const postId = '1';
      const updateData = {
        title: 'Updated Post'
      };

      await blogApi.update(postId, updateData);

      expect(mockAxios.patch).toHaveBeenCalledWith(`/blog/${postId}/`, updateData);
    });
  });

  describe('delete', () => {
    it('should call delete endpoint with post id', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { success: true } };
      mockAxios.delete.mockResolvedValue(mockResponse);

      const postId = '1';
      await blogApi.delete(postId);

      expect(mockAxios.delete).toHaveBeenCalledWith(`/blog/${postId}/`);
    });
  });

  describe('uploadImage', () => {
    it('should call image upload endpoint with form data', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { url: 'image-url', filename: 'image.jpg' } };
      mockAxios.post.mockResolvedValue(mockResponse);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await blogApi.uploadImage(file);

      expect(mockAxios.post).toHaveBeenCalledWith('/blog/upload_image/', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });

    it('should append image file to form data', async () => {
      const mockAxios = require('axios').create();
      const mockResponse = { data: { url: 'image-url', filename: 'image.jpg' } };
      mockAxios.post.mockResolvedValue(mockResponse);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await blogApi.uploadImage(file);

      const formDataCall = mockAxios.post.mock.calls[0][1];
      expect(formDataCall).toBeInstanceOf(FormData);
    });
  });
});







