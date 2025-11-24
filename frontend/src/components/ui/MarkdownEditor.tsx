'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link, 
  Image, 
  Eye,
  EyeOff,
  Save
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
  label = 'Content',
  required = false
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = '', placeholder: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    if (selectedText) {
      newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    } else {
      newText = value.substring(0, start) + prefix + placeholder + suffix + value.substring(end);
    }
    
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + prefix.length + (selectedText ? 0 : placeholder.length);
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const toolbarItems = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), tooltip: 'Italic' },
    { icon: List, action: () => insertMarkdown('- ', '', 'list item'), tooltip: 'Unordered List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', '', 'list item'), tooltip: 'Ordered List' },
    { icon: Quote, action: () => insertMarkdown('> ', '', 'quote'), tooltip: 'Quote' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), tooltip: 'Inline Code' },
    { icon: Link, action: () => insertMarkdown('[', '](url)', 'link text'), tooltip: 'Link' },
    { icon: Image, action: () => insertMarkdown('![', '](image-url)', 'alt text'), tooltip: 'Image' },
  ];

  const renderMarkdown = (text: string) => {
    // Basic markdown rendering for preview
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          {toolbarItems.map((item, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={item.action}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
              title={item.tooltip}
            >
              <item.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded transition-colors ${
              isPreview 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700'
            }`}
            title={isPreview ? 'Edit Mode' : 'Preview Mode'}
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isPreview ? (
          <div className="p-4 bg-white dark:bg-gray-900 min-h-[300px] prose prose-sm max-w-none">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 min-h-[300px] resize-y border-0 focus:ring-0 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            required={required}
          />
        )}
      </div>

      {/* Character count */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
        {value.length} characters
      </div>
    </div>
  );
};

export default MarkdownEditor;







