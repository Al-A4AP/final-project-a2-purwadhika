import type { FC } from "react";
import { TenantReviewsContent } from "./reviews/TenantReviewsContent";
import { useTenantReviewsPageState } from "./reviews/useTenantReviewsPageState";

const ReviewsPage: FC = () => <TenantReviewsContent state={useTenantReviewsPageState()} />;

export default ReviewsPage;
