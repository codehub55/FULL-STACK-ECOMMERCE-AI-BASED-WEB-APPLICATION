import React, { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReview,
  fetchSingleProduct,
  postProductReview,
} from "../../store/slices/productSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);
  const { isPostingReview, isReviewDeleting } = useSelector(
    (state) => state.product
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviews = Array.isArray(productReviews) ? productReviews : [];

  const submitReview = async (e) => {
    e.preventDefault();
    if (!authUser) {
      dispatch(toggleAuthPopup());
      return;
    }
    const trimmed = comment.trim();
    if (!trimmed) return;

    await dispatch(
      postProductReview({
        productId: product.id,
        rating,
        comment: trimmed,
      })
    ).unwrap();
    dispatch(fetchSingleProduct(product.id));
    setComment("");
    setRating(5);
  };

  const removeReview = async () => {
    if (!authUser) return;
    await dispatch(deleteReview(product.id)).unwrap();
    dispatch(fetchSingleProduct(product.id));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="glass-card p-6 text-muted-foreground">
          No reviews yet. Be the first to review this product.
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {reviews.map((review) => {
            const reviewer = review.reviewer || {};
            const canDelete = authUser && reviewer.id === authUser.id;
            return (
              <div key={review.review_id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img
                      src={reviewer.avatar || "https://placehold.co/48x48"}
                      alt={reviewer.name || "Reviewer"}
                      className="w-12 h-12 rounded-lg object-cover bg-secondary"
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {reviewer.name || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < review.rating ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2">
                          {Number(review.rating || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      className="p-2 glass-card rounded-lg"
                      onClick={removeReview}
                      disabled={isReviewDeleting}
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground mt-3">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-panel">
        <h3 className="text-xl font-bold text-foreground mb-3">
          Write a review
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reviews are only allowed for products you’ve purchased.
        </p>

        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              Rating
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const val = idx + 1;
                const active = val <= rating;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setRating(val)}
                    className="p-1"
                    aria-label={`Set rating ${val}`}
                  >
                    <Star
                      className={`w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-muted-foreground">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPostingReview}
            className="w-full px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all disabled:opacity-60"
          >
            {isPostingReview ? "Posting..." : "Post Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsContainer;
