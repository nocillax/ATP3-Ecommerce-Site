// FILE: src/components/ReviewForm.tsx
"use client";

import { useState } from "react";
import NotchedTextarea from "./ui/NotchedTextarea";

const Star = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) => (
  <button type="button" onClick={onClick} className="text-yellow-400">
    <svg
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  </button>
);

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  isSubmitting: boolean;
}

export default function ReviewForm({
  onSubmit,
  isSubmitting,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-light-green p-4 rounded-md mb-6 bg-mint-light/50"
    >
      <h4 className="font-bold text-dark-gray mb-2">Write a Review</h4>
      <div className="mb-2">
        <p className="text-sm font-semibold mb-1">Your Rating</p>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={rating >= star}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <NotchedTextarea
        id="comment"
        name="comment"
        label="Your Comment"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-dark px-6 py-2 rounded-md text-sm mt-4"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
