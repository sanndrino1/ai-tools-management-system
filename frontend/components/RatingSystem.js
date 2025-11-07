'use client';

import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useToast } from '../contexts/ToastContext';
import { LoadingButton } from './Loading';

const RatingSystem = ({ tool, user, onRatingUpdate }) => {
  const { showSuccess, showError } = useToast();
  const [userRating, setUserRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (tool?.id) {
      fetchRatings();
      fetchUserRating();
    }
  }, [tool?.id]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/ratings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRatings(data.data.ratings);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/ratings/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user rating:', error);
    }
  };

  const handleStarClick = (rating) => {
    if (!user) {
      showError('Authentication Required', 'Please log in to rate this tool.');
      return;
    }
    
    setSelectedRating(rating);
    setReviewText(userRating?.review || '');
    setShowReviewModal(true);
  };

  const submitRating = async () => {
    setLoading(true);
    try {
      const method = userRating ? 'PUT' : 'POST';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/ratings`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: selectedRating,
          review: reviewText.trim() || null
        })
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Rating Submitted', 'Thank you for rating this tool!');
        setShowReviewModal(false);
        fetchRatings();
        fetchUserRating();
        onRatingUpdate?.(selectedRating);
      } else {
        showError('Rating Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async () => {
    if (!userRating) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}/ratings`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Rating Removed', 'Your rating has been removed.');
        setShowReviewModal(false);
        fetchRatings();
        fetchUserRating();
        onRatingUpdate?.(0);
      } else {
        showError('Delete Failed', data.message);
      }
    } catch (error) {
      showError('Error', 'Failed to delete rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={interactive ? () => handleStarClick(i) : undefined}
          className={`${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          } ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          disabled={!interactive || loading}
        >
          {i <= rating ? (
            <StarIcon className="h-6 w-6" />
          ) : (
            <StarOutlineIcon className="h-6 w-6" />
          )}
        </button>
      );
    }
    return stars;
  };

  const renderRatingBreakdown = () => {
    if (!statistics?.breakdown) return null;

    const total = statistics.total_ratings;
    
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = statistics.breakdown[rating] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-2 text-sm">
              <span className="w-2">{rating}</span>
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-xs text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h3>
      
      {/* Overall Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold text-gray-900">
            {statistics?.average_rating?.toFixed(1) || '0.0'}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(statistics?.average_rating || 0))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {statistics?.total_ratings || 0} reviews
            </div>
          </div>
        </div>
        
        {/* Rating Breakdown */}
        <div className="flex-1 max-w-xs ml-8">
          {renderRatingBreakdown()}
        </div>
      </div>

      {/* User Rating */}
      {user && (
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">
            {userRating ? 'Your Rating' : 'Rate this tool'}
          </h4>
          <div className="flex items-center space-x-2">
            {renderStars(userRating?.rating || 0, true)}
            {userRating && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="ml-4 text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Review
              </button>
            )}
          </div>
          {userRating?.review && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{userRating.review}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Reviews */}
      {ratings?.data?.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {ratings.data.slice(0, 3).map((rating) => (
              <div key={rating.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{rating.user.name}</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rating.review && (
                  <p className="text-sm text-gray-700">{rating.review}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userRating ? 'Edit Your Rating' : 'Rate This Tool'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {renderStars(selectedRating, true)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this tool..."
                rows={4}
                className="ai-input"
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {reviewText.length}/1000 characters
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                {userRating && (
                  <LoadingButton
                    loading={loading}
                    onClick={deleteRating}
                    className="ai-btn ai-btn-outline text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove Rating
                  </LoadingButton>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="ai-btn ai-btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <LoadingButton
                  loading={loading}
                  onClick={submitRating}
                  className="ai-btn ai-btn-primary"
                  disabled={selectedRating === 0}
                >
                  {userRating ? 'Update' : 'Submit'} Rating
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingSystem;