import type { FC } from "react";
import { useTenantReviewsPageState } from "@/hooks/tenant/reviews/useTenantReviewsPageState";
import { TenantReviewsContent } from "./reviews/TenantReviewsContent";

const ReviewsPage: FC = () => <TenantReviewsContent state={useTenantReviewsPageState()} />;

export default ReviewsPage;
