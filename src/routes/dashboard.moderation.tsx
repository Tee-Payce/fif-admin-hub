import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getComments, getReviews, deleteComment, deleteReview } from "@/api/interactions";
import { Trash2, MessageCircle, Star } from "lucide-react";
import { TableSkeleton, EmptyState, PageStatusBadge, ErrorState } from "@/components/StateIndicators";

export const Route = createFileRoute("/dashboard/moderation")({
  component: ModerationRoute,
});

function ModerationRoute() {
  const [activeTab, setActiveTab] = useState<"comments" | "reviews">("comments");
  const [comments, setComments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [commentsRes, reviewsRes] = await Promise.all([
        getComments(),
        getReviews()
      ]);
      setComments(commentsRes.data);
      setReviews(reviewsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch moderation data", err);
      setError(err?.message || "Could not load moderation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting comment", error);
      alert("Failed to delete comment");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting review", error);
      alert("Failed to delete review");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderation</h1>
          <p className="text-muted-foreground">Manage user comments and book reviews across the platform.</p>
        </div>
        <PageStatusBadge loading={loading} count={comments.length + reviews.length} unit="items" />
      </div>

      <div className="flex gap-4 border-b border-border/40 pb-px">
        <button
          onClick={() => setActiveTab("comments")}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "comments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Comments ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : loading ? (
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <TableSkeleton rows={5} cols={5} />
        </div>
      ) : activeTab === "comments" ? (
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Entity</th>
                  <th className="px-6 py-3 font-medium">Comment</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No comments found.
                    </td>
                  </tr>
                )}
                {comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{comment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">{comment.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                        {comment.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-md">
                        <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-foreground/90">{comment.content}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Book</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Review</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No reviews found.
                    </td>
                  </tr>
                )}
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{review.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">{review.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground/90 font-medium">{review.book?.title || 'Unknown Book'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs text-foreground/80 truncate">
                        {review.comment || <span className="italic text-muted-foreground">No comment</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
