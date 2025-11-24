/**
 * Blog State Management Hook - Centralized state management for blog operations
 */
import { useState, useEffect, useCallback, useReducer } from 'react';
import { BlogApi } from '../services/BlogApiService';
import {
  BlogState,
  BlogPostList,
  BlogPostDetail,
  BlogCategory,
  BlogTag,
  BlogFilters,
  BlogSortOptions,
  BlogDashboard,
  ReadingAnalytics,
  BlogInteractionResponse,
  ReadingProgressResponse,
  BlogPostComment,
  CommentForm,
  BlogSearchRequest
} from '../models/BlogModels';

// Action types for state management
type BlogAction =
  | { type: 'SET_LOADING'; payload: { section: keyof BlogState; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { section: keyof BlogState; error: string | null } }
  | { type: 'SET_POSTS'; payload: { posts: BlogPostList[]; section: 'list' | 'featured' | 'popular' | 'recent' | 'related' | 'search' } }
  | { type: 'SET_POST_DETAIL'; payload: BlogPostDetail | null }
  | { type: 'SET_CATEGORIES'; payload: BlogCategory[] }
  | { type: 'SET_TAGS'; payload: BlogTag[] }
  | { type: 'SET_INTERACTIONS'; payload: { likes: string[]; bookmarks: string[] } }
  | { type: 'SET_READING_PROGRESS'; payload: { current: any; history: any[]; analytics: ReadingAnalytics | null } }
  | { type: 'SET_COMMENTS'; payload: BlogPostComment[] }
  | { type: 'SET_DASHBOARD'; payload: BlogDashboard | null }
  | { type: 'UPDATE_POST_INTERACTION'; payload: { postId: string; type: 'like' | 'bookmark'; action: 'add' | 'remove' } }
  | { type: 'CLEAR_ERRORS' };

// Initial state
const initialState: BlogState = {
  posts: {
    list: [],
    detail: null,
    featured: [],
    popular: [],
    recent: [],
    related: [],
    search: [],
    loading: false,
    error: null,
  },
  categories: {
    list: [],
    loading: false,
    error: null,
  },
  tags: {
    list: [],
    loading: false,
    error: null,
  },
  interactions: {
    likes: [],
    bookmarks: [],
    shares: [],
    loading: false,
    error: null,
  },
  readingProgress: {
    current: null,
    history: [],
    analytics: null,
    loading: false,
    error: null,
  },
  comments: {
    list: [],
    loading: false,
    error: null,
  },
  dashboard: {
    data: null,
    loading: false,
    error: null,
  },
};

// Reducer function
function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          loading: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          error: action.payload.error,
        },
      };

    case 'SET_POSTS':
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.payload.section]: action.payload.posts,
        },
      };

    case 'SET_POST_DETAIL':
      return {
        ...state,
        posts: {
          ...state.posts,
          detail: action.payload,
        },
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: {
          ...state.categories,
          list: action.payload,
        },
      };

    case 'SET_TAGS':
      return {
        ...state,
        tags: {
          ...state.tags,
          list: action.payload,
        },
      };

    case 'SET_INTERACTIONS':
      return {
        ...state,
        interactions: {
          ...state.interactions,
          likes: action.payload.likes,
          bookmarks: action.payload.bookmarks,
        },
      };

    case 'SET_READING_PROGRESS':
      return {
        ...state,
        readingProgress: {
          ...state.readingProgress,
          current: action.payload.current,
          history: action.payload.history,
          analytics: action.payload.analytics,
        },
      };

    case 'SET_COMMENTS':
      return {
        ...state,
        comments: {
          ...state.comments,
          list: action.payload,
        },
      };

    case 'SET_DASHBOARD':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          data: action.payload,
        },
      };

    case 'UPDATE_POST_INTERACTION':
      const { postId, type, action: interactionAction } = action.payload;
      const currentList = state.interactions[type === 'like' ? 'likes' : 'bookmarks'];
      const updatedList = interactionAction === 'add'
        ? [...currentList, postId]
        : currentList.filter(id => id !== postId);

      return {
        ...state,
        interactions: {
          ...state.interactions,
          [type === 'like' ? 'likes' : 'bookmarks']: updatedList,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        posts: { ...state.posts, error: null },
        categories: { ...state.categories, error: null },
        tags: { ...state.tags, error: null },
        interactions: { ...state.interactions, error: null },
        readingProgress: { ...state.readingProgress, error: null },
        comments: { ...state.comments, error: null },
        dashboard: { ...state.dashboard, error: null },
      };

    default:
      return state;
  }
}

// Custom hook for blog state management
export function useBlogState() {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Helper function to set loading state
  const setLoading = useCallback((section: keyof BlogState, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { section, loading } });
  }, []);

  // Helper function to set error state
  const setError = useCallback((section: keyof BlogState, error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: { section, error } });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  // Blog Posts Operations
  const fetchPosts = useCallback(async (
    filters?: BlogFilters,
    sort?: BlogSortOptions,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const response = await BlogApi.posts.getPosts(filters, sort, page, limit);
      dispatch({ type: 'SET_POSTS', payload: { posts: response.results, section: 'list' } });
      
      return response;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to fetch posts');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  const fetchPost = useCallback(async (slug: string) => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const post = await BlogApi.posts.getPost(slug);
      dispatch({ type: 'SET_POST_DETAIL', payload: post });
      
      return post;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to fetch post');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  const fetchFeaturedPosts = useCallback(async () => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const posts = await BlogApi.posts.getFeaturedPosts();
      dispatch({ type: 'SET_POSTS', payload: { posts, section: 'featured' } });
      
      return posts;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to fetch featured posts');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  const fetchPopularPosts = useCallback(async () => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const posts = await BlogApi.posts.getPopularPosts();
      dispatch({ type: 'SET_POSTS', payload: { posts, section: 'popular' } });
      
      return posts;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to fetch popular posts');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  const fetchRecentPosts = useCallback(async () => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const posts = await BlogApi.posts.getRecentPosts();
      dispatch({ type: 'SET_POSTS', payload: { posts, section: 'recent' } });
      
      return posts;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to fetch recent posts');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  const searchPosts = useCallback(async (searchRequest: BlogSearchRequest) => {
    try {
      setLoading('posts', true);
      setError('posts', null);
      
      const response = await BlogApi.posts.searchPosts(searchRequest);
      dispatch({ type: 'SET_POSTS', payload: { posts: response.results, section: 'search' } });
      
      return response;
    } catch (error: any) {
      setError('posts', error.message || 'Failed to search posts');
      throw error;
    } finally {
      setLoading('posts', false);
    }
  }, [setLoading, setError]);

  // Categories Operations
  const fetchCategories = useCallback(async () => {
    try {
      setLoading('categories', true);
      setError('categories', null);
      
      const categories = await BlogApi.categories.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      
      return categories;
    } catch (error: any) {
      setError('categories', error.message || 'Failed to fetch categories');
      throw error;
    } finally {
      setLoading('categories', false);
    }
  }, [setLoading, setError]);

  // Tags Operations
  const fetchTags = useCallback(async () => {
    try {
      setLoading('tags', true);
      setError('tags', null);
      
      const tags = await BlogApi.tags.getTags();
      dispatch({ type: 'SET_TAGS', payload: tags });
      
      return tags;
    } catch (error: any) {
      setError('tags', error.message || 'Failed to fetch tags');
      throw error;
    } finally {
      setLoading('tags', false);
    }
  }, [setLoading, setError]);

  // Interactions Operations
  const likePost = useCallback(async (slug: string, action: 'like' | 'unlike') => {
    try {
      setLoading('interactions', true);
      setError('interactions', null);
      
      const response: BlogInteractionResponse = await BlogApi.interactions.likePost(slug, action);
      
      // Update local state
      dispatch({
        type: 'UPDATE_POST_INTERACTION',
        payload: {
          postId: slug,
          type: 'like',
          action: action === 'like' ? 'add' : 'remove'
        }
      });
      
      return response;
    } catch (error: any) {
      setError('interactions', error.message || 'Failed to like post');
      throw error;
    } finally {
      setLoading('interactions', false);
    }
  }, [setLoading, setError]);

  const bookmarkPost = useCallback(async (slug: string, action: 'bookmark' | 'unbookmark') => {
    try {
      setLoading('interactions', true);
      setError('interactions', null);
      
      const response: BlogInteractionResponse = await BlogApi.interactions.bookmarkPost(slug, action);
      
      // Update local state
      dispatch({
        type: 'UPDATE_POST_INTERACTION',
        payload: {
          postId: slug,
          type: 'bookmark',
          action: action === 'bookmark' ? 'add' : 'remove'
        }
      });
      
      return response;
    } catch (error: any) {
      setError('interactions', error.message || 'Failed to bookmark post');
      throw error;
    } finally {
      setLoading('interactions', false);
    }
  }, [setLoading, setError]);

  const sharePost = useCallback(async (slug: string, platform: string) => {
    try {
      setLoading('interactions', true);
      setError('interactions', null);
      
      const response: BlogInteractionResponse = await BlogApi.interactions.sharePost(slug, platform);
      
      return response;
    } catch (error: any) {
      setError('interactions', error.message || 'Failed to share post');
      throw error;
    } finally {
      setLoading('interactions', false);
    }
  }, [setLoading, setError]);

  // Reading Progress Operations
  const updateReadingProgress = useCallback(async (postId: string, progress: number, timeSpent: number = 0) => {
    try {
      setLoading('readingProgress', true);
      setError('readingProgress', null);
      
      const response: ReadingProgressResponse = await BlogApi.readingProgress.updateProgress({
        post: postId,
        progress_percentage: progress,
        time_spent: timeSpent,
        last_position: progress
      });
      
      return response;
    } catch (error: any) {
      setError('readingProgress', error.message || 'Failed to update reading progress');
      throw error;
    } finally {
      setLoading('readingProgress', false);
    }
  }, [setLoading, setError]);

  const fetchReadingAnalytics = useCallback(async () => {
    try {
      setLoading('readingProgress', true);
      setError('readingProgress', null);
      
      const analytics = await BlogApi.readingProgress.getReadingAnalytics();
      dispatch({
        type: 'SET_READING_PROGRESS',
        payload: { current: null, history: [], analytics }
      });
      
      return analytics;
    } catch (error: any) {
      setError('readingProgress', error.message || 'Failed to fetch reading analytics');
      throw error;
    } finally {
      setLoading('readingProgress', false);
    }
  }, [setLoading, setError]);

  // Comments Operations
  const fetchComments = useCallback(async (postSlug: string) => {
    try {
      setLoading('comments', true);
      setError('comments', null);
      
      const comments = await BlogApi.comments.getComments(postSlug);
      dispatch({ type: 'SET_COMMENTS', payload: comments });
      
      return comments;
    } catch (error: any) {
      setError('comments', error.message || 'Failed to fetch comments');
      throw error;
    } finally {
      setLoading('comments', false);
    }
  }, [setLoading, setError]);

  const createComment = useCallback(async (commentData: CommentForm & { post: string }) => {
    try {
      setLoading('comments', true);
      setError('comments', null);
      
      const comment = await BlogApi.comments.createComment(commentData);
      
      // Refresh comments list
      await fetchComments(commentData.post);
      
      return comment;
    } catch (error: any) {
      setError('comments', error.message || 'Failed to create comment');
      throw error;
    } finally {
      setLoading('comments', false);
    }
  }, [setLoading, setError, fetchComments]);

  // Dashboard Operations
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading('dashboard', true);
      setError('dashboard', null);
      
      const dashboard = await BlogApi.posts.getDashboard();
      dispatch({ type: 'SET_DASHBOARD', payload: dashboard });
      
      return dashboard;
    } catch (error: any) {
      setError('dashboard', error.message || 'Failed to fetch dashboard');
      throw error;
    } finally {
      setLoading('dashboard', false);
    }
  }, [setLoading, setError]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchCategories(),
          fetchTags(),
          fetchFeaturedPosts(),
          fetchPopularPosts(),
          fetchRecentPosts(),
        ]);
      } catch (error) {
        console.error('Failed to initialize blog data:', error);
      }
    };

    initializeData();
  }, [fetchCategories, fetchTags, fetchFeaturedPosts, fetchPopularPosts, fetchRecentPosts]);

  return {
    // State
    state,
    
    // Actions
    fetchPosts,
    fetchPost,
    fetchFeaturedPosts,
    fetchPopularPosts,
    fetchRecentPosts,
    searchPosts,
    fetchCategories,
    fetchTags,
    likePost,
    bookmarkPost,
    sharePost,
    updateReadingProgress,
    fetchReadingAnalytics,
    fetchComments,
    createComment,
    fetchDashboard,
    
    // Utilities
    clearErrors,
    setLoading,
    setError,
  };
}

export default useBlogState;

