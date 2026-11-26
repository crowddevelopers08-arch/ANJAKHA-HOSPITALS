import type { Metadata } from "next";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewRating from "@/components/review/ReviewRating";
import { reviewFunnel, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Share Your Review | ${site.name}, ${reviewFunnel.branch}`,
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <ReviewCard size="review">
      <ReviewRating />
    </ReviewCard>
  );
}
