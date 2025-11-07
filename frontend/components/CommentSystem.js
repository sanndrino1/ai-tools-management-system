'use client';

import { useState, useEffect } from 'react';
import { 
  ChatBubbleBottomCenterTextIcon,
  PencilIcon,
  TrashIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../contexts/ToastContext';
import { LoadingButton } from './Loading';

const CommentSystem = ({ tool, user }) => {
  const { showSuccess, showError } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (tool?.id) {
      fetchComments();
    }
  }, [tool?.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const submitComment = async () => {
    if (!user) {
      showError('Authentication Required', 'Please log in to comment.');
      return;
    }

    if (newComment.trim().length < 10) {
      showError('Invalid Input', 'Comment must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parent_id: replyTo?.id || null
        })
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Comment Posted', 'Your comment has been posted successfully.');
        setNewComment('');
        setReplyTo(null);
        fetchComments();
      } else {
        showError('Comment Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async () => {
    if (editContent.trim().length < 10) {
      showError('Invalid Input', 'Comment must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${editComment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editContent.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Comment Updated', 'Your comment has been updated.');
        setEditComment(null);
        setEditContent('');
        fetchComments();
      } else {
        showError('Update Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (comment) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Comment Deleted', 'Comment has been deleted.');
        fetchComments();
      } else {
        showError('Delete Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to delete comment');
    }
  };

  const startReply = (comment) => {
    setReplyTo(comment);
    setNewComment('');
  };

  const startEdit = (comment) => {
    setEditComment(comment);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditComment(null);
    setEditContent('');
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  const canEditComment = (comment) => {
    return user && (user.id === comment.user_id || ['owner', 'project_manager'].includes(user.role));
  };

  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${
        isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''
      } py-4 ${!isReply ? 'border-b border-gray-200' : ''}`}
    >
      {editComment?.id === comment.id ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="ai-input"
            maxLength={2000}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {editContent.length}/2000 characters
            </div>
            <div className="flex space-x-2">
              <button
                onClick={cancelEdit}
                className="ai-btn ai-btn-outline ai-btn-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <LoadingButton
                loading={loading}
                onClick={updateComment}
                className="ai-btn ai-btn-primary ai-btn-sm"
                disabled={editContent.trim().length < 10}
              >
                Update
              </LoadingButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{comment.user.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
              {comment.is_edited && (
                <span className="text-xs text-gray-500 italic">(edited)</span>
              )}
            </div>
            
            {canEditComment(comment) && (
              <div className="flex space-x-1">
                <button
                  onClick={() => startEdit(comment)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Edit comment"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteComment(comment)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Delete comment"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
          
          {user && !isReply && (
            <button
              onClick={() => startReply(comment)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
        </>
      )}

      {/* Render Replies */}
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      {user && (
        <div className="mb-6">
          {replyTo && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  Replying to {replyTo.user.name}
                </span>
                <button
                  onClick={cancelReply}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <span className="sr-only">Cancel reply</span>
                  ×
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? `Reply to ${replyTo.user.name}...` : "Share your thoughts about this tool..."}
              rows={3}
              className="ai-input"
              maxLength={2000}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {newComment.length}/2000 characters (minimum 10)
              </div>
              <div className="flex space-x-2">
                {replyTo && (
                  <button
                    onClick={cancelReply}
                    className="ai-btn ai-btn-outline ai-btn-sm"
                    disabled={loading}
                  >
                    Cancel Reply
                  </button>
                )}
                <LoadingButton
                  loading={loading}
                  onClick={submitComment}
                  className="ai-btn ai-btn-primary ai-btn-sm"
                  disabled={newComment.trim().length < 10}
                >
                  {replyTo ? 'Post Reply' : 'Post Comment'}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
          <p className="text-gray-600 mb-2">Join the conversation!</p>
          <button className="ai-btn ai-btn-primary ai-btn-sm">
            Log in to comment
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-0">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ChatBubbleBottomCenterTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet.</p>
            {user && <p className="text-sm">Be the first to share your thoughts!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;