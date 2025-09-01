'use client';

import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { blogApi } from '@/lib/api';
import { isValidImageUrl } from '@/lib/imageUtils';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);



  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await blogApi.uploadImage(file);
      const imageUrl = response.data.url;
      
      // Validate the returned URL
      if (!isValidImageUrl(imageUrl)) {
        setError('Invalid image URL received. Please try uploading again.');
        return;
      }
      
      setUploadedImage(imageUrl);
      onImageUploaded(imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    onImageUploaded('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {!uploadedImage && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isUploading ? 'Uploading...' : 'Upload an image'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports JPEG, PNG, GIF, WebP up to 5MB
            </p>
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </label>
        </div>
      )}

      {/* Uploaded Image Preview */}
      {uploadedImage && isValidImageUrl(uploadedImage) && (
        <div className="relative">
          <Image
            src={uploadedImage}
            alt="Uploaded image"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Image uploaded successfully
          </div>
        </div>
      )}

      {/* Invalid Image URL Warning */}
      {uploadedImage && !isValidImageUrl(uploadedImage) && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-yellow-700 dark:text-yellow-400">
            Invalid image URL detected. Please upload a valid image file.
          </span>
          <button
            onClick={removeImage}
            className="ml-auto text-yellow-600 hover:text-yellow-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

