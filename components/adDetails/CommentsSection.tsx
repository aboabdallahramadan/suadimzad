'use client'
import { useLocale, useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Comment {
  id: number;
  comment: string;
  offerId: number;
  userId: number;
  userName: string;
  userProfilePhotoUrl: string;
  replyToCommentId: number | null;
  createdAt: string;
  repliesCount: number;
}

interface PaginatedResponse {
  items: Comment[];
  hasMore: boolean;
  nextCursor: number | null;
}

const CommentsSection = () => {
  const t = useTranslations();
  const params = useParams();
  const offerId = parseInt(params.adid as string);
  const local = useLocale();
  const { getToken } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  // For replies
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [replies, setReplies] = useState<Record<number, Comment[]>>({});
  const [replyCursors, setReplyCursors] = useState<Record<number, number | null>>({});
  const [hasMoreReplies, setHasMoreReplies] = useState<Record<number, boolean>>({});
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  // Fetch initial comments
  useEffect(() => {
    if (offerId) {
      fetchComments();
    }
  }, [offerId]);

  const fetchComments = async (cursor: number | null = null) => {
    try {
      setIsLoading(true);
      const url = `http://localhost:5000/api/offers/${offerId}/comments${cursor ? `?cursor=${cursor}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': local
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      console.log(data);
      if (data.success) {
        const result = data.data as PaginatedResponse;
        if (cursor) {
          setComments(prev => [...prev, ...result.items]);
        } else {
          setComments(result.items);
        }
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReplies = async (commentId: number, cursor: number | null = null) => {
    try {
      const url = `http://localhost:5000/api/offers/comments/${commentId}/replies${cursor ? `?cursor=${cursor}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': local
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch replies');
      }

      const data = await response.json();
      if (data.success) {
        const result = data.data as PaginatedResponse;
        if (cursor) {
          setReplies(prev => ({
            ...prev,
            [commentId]: [...(prev[commentId] || []), ...result.items]
          }));
        } else {
          setReplies(prev => ({
            ...prev,
            [commentId]: result.items
          }));
        }
        setHasMoreReplies(prev => ({
          ...prev,
          [commentId]: result.hasMore
        }));
        setReplyCursors(prev => ({
          ...prev,
          [commentId]: result.nextCursor
        }));
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      console.log(getToken());
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': local
        },
        body: JSON.stringify({
          comment: newComment,
          replyToCommentId: null
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    const replyContent = replyText[commentId];
    if (!replyContent?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/offers/${offerId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          'Accept-Language': local
        },
        body: JSON.stringify({
          comment: replyContent,
          replyToCommentId: commentId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      const data = await response.json();

      if (data.success) {
        // Update replies list for this comment
        setReplies(prev => ({
          ...prev,
          [commentId]: [data.data, ...(prev[commentId] || [])]
        }));

        // Update the comment's reply count
        setComments(prev => prev.map(c =>
          c.id === commentId
            ? { ...c, repliesCount: c.repliesCount + 1 }
            : c
        ));

        // Clear the reply input
        setReplyText(prev => ({
          ...prev,
          [commentId]: ''
        }));
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const toggleReplies = (commentId: number) => {
    const isOpen = openReplies[commentId];

    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !isOpen
    }));

    // Fetch replies if we're opening and don't have them yet
    if (!isOpen && (!replies[commentId] || replies[commentId].length === 0)) {
      fetchReplies(commentId);
    }
  };

  const loadMoreComments = () => {
    if (hasMore && nextCursor) {
      fetchComments(nextCursor);
    }
  };

  const loadMoreReplies = (commentId: number) => {
    if (hasMoreReplies[commentId] && replyCursors[commentId]) {
      fetchReplies(commentId, replyCursors[commentId]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      {/* Add Comment */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-color">{t("comments.addComment")}</h3>
        <form onSubmit={handleSubmitComment}>
          <textarea
            placeholder={t("comments.addCommentPlaceholder")}
            className="w-full p-4 border border-secondary-gray rounded-lg focus:outline-none focus:border-primary-accent resize-none"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 bg-primary-color text-white px-8 py-3 rounded-lg hover:bg-primary-dark w-full sm:w-auto"
            disabled={!newComment.trim() || isLoading}
          >
            {isLoading ? t("common.loading") : t("comments.addComment")}
          </button>
        </form>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-color">
          {t("comments.comments")} ({comments.length})
        </h3>

        {comments.length === 0 && !isLoading && (
          <p className="text-secondary-gray text-center py-4">{t("comments.noComments")}</p>
        )}

        {isLoading && comments.length === 0 && (
          <p className="text-secondary-gray text-center py-4">{t("common.loading")}</p>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-secondary-gray pb-6 mb-6 last:border-0 last:pb-0">
              <div className="flex space-x-4">
                <img
                  src={`http://localhost:5000/uploads/${comment.userProfilePhotoUrl}`}
                  alt={comment.userName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start lg:items-center justify-between mb-2 flex-col lg:flex-row">
                    <h4 className="font-semibold text-primary-color">{comment.userName}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-secondary-gray text-xs sm:text-sm">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{comment.comment}</p>

                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-primary-accent text-sm hover:underline"
                  >
                    {openReplies[comment.id]
                      ? t("comments.hideReplies")
                      : `${t("comments.showReplies")} (${comment.repliesCount})`}
                  </button>

                  {/* Replies section */}
                  {openReplies[comment.id] && (
                    <div className="mt-4 pl-4 border-l-2 border-secondary-gray">
                      {/* Reply form */}
                      <div className="mb-4">
                        <textarea
                          placeholder={t("comments.replyPlaceholder")}
                          className="w-full p-3 border border-secondary-gray rounded-lg focus:outline-none focus:border-primary-accent resize-none"
                          rows={2}
                          value={replyText[comment.id] || ''}
                          onChange={(e) => setReplyText(prev => ({
                            ...prev,
                            [comment.id]: e.target.value
                          }))}
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          className="mt-2 bg-primary-color text-white px-4 py-2 rounded-lg hover:bg-primary-dark text-sm"
                          disabled={!replyText[comment.id]?.trim()}
                        >
                          {t("comments.reply")}
                        </button>
                      </div>

                      {/* Replies list */}
                      {replies[comment.id] && replies[comment.id].length > 0 ? (
                        <div className="space-y-4">
                          {replies[comment.id].map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <img
                                src={`http://localhost:5000/uploads/${reply.userProfilePhotoUrl}`}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1 flex-col sm:flex-row">
                                  <h5 className="font-medium text-primary-color text-sm">{reply.userName}</h5>
                                  <span className="text-secondary-gray text-xs">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-foreground text-sm">{reply.comment}</p>
                              </div>
                            </div>
                          ))}

                          {hasMoreReplies[comment.id] && (
                            <button
                              onClick={() => loadMoreReplies(comment.id)}
                              className="text-primary-accent text-sm hover:underline"
                            >
                              {t("comments.loadMoreReplies")}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-secondary-gray text-sm">
                          {t("comments.noReplies")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && comments.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreComments}
              className="bg-white border border-primary-color text-primary-color px-6 py-2 rounded-lg hover:bg-primary-color hover:text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("comments.loadMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;