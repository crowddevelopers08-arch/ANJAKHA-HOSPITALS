import type { Metadata } from "next";
import ReviewCard from "@/components/review/ReviewCard";
import FeedbackForm from "@/components/review/FeedbackForm";
import { reviewFunnel, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Help Us Improve | ${site.name}, ${reviewFunnel.branch}`,
  robots: { index: false, follow: false },
};

export default function ClientFeedbackPage() {
  return (
    <ReviewCard size="feedback">
      <FeedbackForm />
    </ReviewCard>
  );
}
