// FILE: src/components/ReviewCard.tsx
import { Review } from "@/types";

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    fill={filled ? "#facc15" : "none"}
    viewBox="0 0 24 24"
    stroke="#facc15"
    strokeWidth="1.5"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

export default function ReviewCard({ review }: { review: Review }) {
  // Format the date into a readable string like "June 29, 2025"
  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-b border-light-green py-4">
      {/*  This container now uses flexbox to separate items */}
      <div className="flex items-center justify-between mb-2">
        {/* This div groups the stars and the name on the left */}
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={Number(review.rating) >= star} />
            ))}
          </div>
          <p className="ml-3 font-bold text-sm text-dark-gray">
            {review.user.name}
          </p>
        </div>

        {/*  This is the new date, which will be pushed to the right */}
        <p className="text-xs text-dark-gray/60">{reviewDate}</p>
      </div>

      <p className="text-sm font-montserrat text-dark-gray/90">
        {review.comment}
      </p>
    </div>
  );
}
