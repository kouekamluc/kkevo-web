'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Link2, 
  Share2,
  Copy,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

/**
 * Enhanced Social Share Component
 * Provides beautiful social sharing buttons with copy link functionality
 */
const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  className = '',
  variant = 'horizontal'
}) => {
  const [copied, setCopied] = React.useState(false);
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    // Try native share API first (mobile)
    if (navigator.share && platform !== 'email') {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error, fall back to window.open
      }
    }

    // Fallback to window.open
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    
    // Track share (optional - you can add analytics here)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'article',
        item_id: url,
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const buttonClass = variant === 'compact' 
    ? 'p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
    : 'flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:shadow-md';

  const containerClass = variant === 'vertical'
    ? 'flex flex-col space-y-3'
    : variant === 'compact'
    ? 'flex items-center space-x-2'
    : 'flex items-center space-x-3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${containerClass} ${className}`}
    >
      {variant !== 'compact' && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Share:
        </span>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className={buttonClass}
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
        {variant !== 'compact' && <span className="text-sm">Twitter</span>}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className={buttonClass}
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
        {variant !== 'compact' && <span className="text-sm">Facebook</span>}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        className={buttonClass}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
        {variant !== 'compact' && <span className="text-sm">LinkedIn</span>}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShare('email', shareLinks.email)}
        className={buttonClass}
        aria-label="Share via Email"
      >
        <Mail className="w-5 h-5" />
        {variant !== 'compact' && <span className="text-sm">Email</span>}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className={buttonClass}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-600" />
            {variant !== 'compact' && <span className="text-sm text-green-600">Copied!</span>}
          </>
        ) : (
          <>
            <Link2 className="w-5 h-5" />
            {variant !== 'compact' && <span className="text-sm">Copy Link</span>}
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default SocialShare;

