'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Save, ArrowLeft, Eye, EyeOff, Upload, X, 
  Calendar, User, Tag, FolderOpen, Settings,
  FileText, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { blogApi } from '@/lib/api';
import { FadeInSection } from '@/components/animations';
import { AnimatedCard, AnimatedButton, Skeleton } from '@/components/ui';
import { BlogPost, BlogCategory } from '@/types';

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  order: number;
  meta_title: string;
  meta_description: string;
  published_at: string;
}

interface BlogPostFormProps {
  post?: BlogPost;
  mode?: 'create' | 'edit';
}

export default function BlogPostForm({ post, mode = 'create' }: BlogPostFormProps) {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<BlogPostFormData>({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.body || '',
      category: post?.category?.id || '',
      tags: post?.tags || [],
      status: post?.status || 'draft',
      is_featured: post?.is_featured || false,
      order: post?.order || 0,
      meta_title: post?.meta_title || '',
      meta_description: post?.meta_description || '',
      published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : ''
    }
  });

  const watchedTitle = watch('title');
  const watchedStatus = watch('status');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !post?.slug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, setValue, post?.slug]);

  // Auto-set published_at when status changes to published
  useEffect(() => {
    if (watchedStatus === 'published' && !watch('published_at')) {
      setValue('published_at', new Date().toISOString().split('T')[0]);
    }
  }, [watchedStatus, setValue, watch]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogApi.getCategories();
        const categoriesData = response.data.results || response.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission
  const onSubmit = async (data: BlogPostFormData) => {
    try {
      setIsSaving(true);
      
      if (mode === 'edit' && post) {
        await blogApi.update(post.id, data);
      } else {
        await blogApi.create(data);
      }
      
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag input
  const handleTagInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      const currentTags = watch('tags');
      if (!currentTags.includes(tagInput.trim())) {
        setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AnimatedButton
              onClick={() => router.back()}
              variant="outline"
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </AnimatedButton>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {mode === 'edit' ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {mode === 'edit' ? 'Update your blog post content and settings' : 'Write and publish your next blog post'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <AnimatedButton
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
            >
              {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {previewMode ? 'Hide Preview' : 'Preview'}
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Post'}
            </AnimatedButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: 'Title is required' }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter post title..."
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug *
                    </label>
                    <Controller
                      name="slug"
                      control={control}
                      rules={{ required: 'Slug is required' }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="post-url-slug"
                        />
                      )}
                    />
                    {errors.slug && (
                      <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Excerpt *
                    </label>
                    <Controller
                      name="excerpt"
                      control={control}
                      rules={{ required: 'Excerpt is required' }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Brief summary of your post..."
                        />
                      )}
                    />
                    {errors.excerpt && (
                      <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Content */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Content
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: 'Content is required' }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={15}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                        placeholder="Write your blog post content here... You can use Markdown formatting."
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </AnimatedCard>

            {/* Preview */}
            {previewMode && (
              <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </h2>
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <h1>{watch('title') || 'Post Title'}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {watch('excerpt') || 'Post excerpt will appear here...'}
                    </p>
                    <div className="mt-6">
                      {watch('content') ? (
                        <div className="whitespace-pre-wrap">{watch('content')}</div>
                      ) : (
                        <p className="text-gray-400 italic">Content will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Publishing
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      )}
                    />
                  </div>

                  {watchedStatus === 'published' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Publish Date
                      </label>
                      <Controller
                        name="published_at"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        )}
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <Controller
                      name="is_featured"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured Post
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Order
                    </label>
                    <Controller
                      name="order"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Categorization */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Categorization
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Type a tag and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {watch('tags').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* SEO & Metadata */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2" />
                  SEO & Metadata
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <Controller
                      name="meta_title"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="SEO title (optional)"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <Controller
                      name="meta_description"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="SEO description (optional)"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Featured Image */}
            <AnimatedCard className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Featured Image
                </h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={400}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload image
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
