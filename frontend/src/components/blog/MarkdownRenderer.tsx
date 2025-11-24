'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Enhanced Markdown Renderer with syntax highlighting support
 * Renders markdown content with proper styling and code highlighting
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply basic syntax highlighting styles
    // Note: For full syntax highlighting, consider adding Prism.js or highlight.js
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        (block as HTMLElement).classList.add('language-text');
      });
    }
  }, [content]);

  // Enhanced markdown rendering function
  const renderMarkdown = (text: string): string => {
    if (!text) return '';

    let html = text;

    // Headers with IDs for table of contents
    html = html.replace(/^### (.*$)/gim, (match, title) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h3 id="${id}" class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">${title}</h3>`;
    });
    html = html.replace(/^## (.*$)/gim, (match, title) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h2 id="${id}" class="text-3xl font-bold mt-10 mb-6 text-gray-900 dark:text-white">${title}</h2>`;
    });
    html = html.replace(/^# (.*$)/gim, (match, title) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h1 id="${id}" class="text-4xl font-bold mt-12 mb-8 text-gray-900 dark:text-white">${title}</h1>`;
    });

    // Code blocks with language detection
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      return `<pre class="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-6"><code class="language-${language} text-sm text-gray-100">${escapedCode}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400">$1</code>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6 w-full h-auto shadow-lg" loading="lazy" />');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 dark:border-indigo-400 pl-6 py-2 my-6 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-r">$1</blockquote>');

    // Unordered lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc text-gray-700 dark:text-gray-300">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="my-4 space-y-2">$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal text-gray-700 dark:text-gray-300">$1</li>');
    html = html.replace(/(<li class="ml-6 mb-2 list-decimal.*<\/li>)/s, '<ol class="my-4 space-y-2 list-decimal">$1</ol>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300 dark:border-gray-700" />');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">');
    html = '<p class="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-6[^"]*"><\/p>/g, '');

    return html;
  };

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;

