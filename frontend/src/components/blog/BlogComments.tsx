'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Reply, ThumbsUp, Flag, Edit, Trash2, User, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { blogApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Comment {
  id: number;
  content: string;
  user: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    picture?: string;
  };
  post: string;
  parent?: number;
  is_approved: boolean;
  is_moderated: boolean;
  created_at: string;
  updated_at: string;
  reply_count: number;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postId: string;
  postSlug: string;
  initialComments?: Comment[];
  onCommentAction?: (action: string, commentId: number) => void;
}

const BlogComments: React.FC<BlogCommentsProps> = ({
  postId,
  postSlug,
  initialComments = [],
  onCommentAction
}) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await blogApi.getComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await blogApi.createComment({
        post: postId,
        content: newComment.trim(),
        parent: null
      });

      const comment = response.data;
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment posted successfully!');
      onCommentAction?.('create', comment.id);
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyTo) return;

    setIsLoading(true);
    try {
      const response = await blogApi.replyToComment(replyTo, {
        content: replyContent.trim()
      });

      const reply = response.data;
      setComments(prev => prev.map(comment => {
        if (comment.id === replyTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
            reply_count: (comment.reply_count || 0) + 1
          };
        }
        return comment;
      }));

      setReplyContent('');
      setReplyTo(null);
      toast.success('Reply posted successfully!');
      onCommentAction?.('reply', reply.id);
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    setIsLoading(true);
    try {
      const response = await blogApi.updateComment(commentId, {
        content: editContent.trim()
      });

      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: editContent.trim(), updated_at: new Date().toISOString() };
        }
        return comment;
      }));

      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated successfully!');
      onCommentAction?.('edit', commentId);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsLoading(true);
    try {
      await blogApi.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
      onCommentAction?.('delete', commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    // This would be implemented when comment likes are added to the backend
    toast.info('Comment likes coming soon!');
  };

  const handleReportComment = async (commentId: number) => {
    // This would be implemented when comment reporting is added to the backend
    toast.info('Comment reporting coming soon!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const sortComments = (comments: Comment[]) => {
    switch (sortBy) {
      case 'oldest':
        return [...comments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'popular':
        return [...comments].sort((a, b) => (b.reply_count || 0) - (a.reply_count || 0));
      default:
        return [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg border border-gray-200 p-4 ${isReply ? 'ml-8 border-l-2 border-blue-200' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.user.picture ? (
            <img
              src={comment.user.picture}
              alt={comment.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.user.first_name || comment.user.username}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.created_at)}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
          
          {editingComment === comment.id ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Edit your comment..."
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleEditComment(comment.id)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm">
            {!isReply && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
            
            <button
              onClick={() => handleLikeComment(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Like</span>
            </button>
            
            <button
              onClick={() => handleReportComment(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
            
            {(user?.id === comment.user.id || user?.isAdmin) && (
              <>
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
          
          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <form onSubmit={handleSubmitReply}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Write your reply..."
                  required
                />
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !replyContent.trim()}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <span>Comments ({comments.length})</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Replies</option>
          </select>
        </div>
      </div>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Write a comment..."
                required
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Comments are moderated and will appear after approval.
                </p>
                <button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Join the conversation</h4>
          <p className="text-gray-600 mb-4">
            Please log in to leave a comment and engage with other readers.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Log In to Comment
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <AnimatePresence>
          {sortComments(comments).map(comment => renderComment(comment))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogComments;


