export type ReviewItem = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  avatarColor: string;
  avatarLabel: string;
};

export type ReviewSummary = {
  averageRating: number;
  totalStars: number;
  headline: string;
};

export type AddReviewForm = {
  rating: number;
  comment: string;
};

export type ReviewPayload = {
  userName?: string;
  rating: number;
  comment: string;
  createdAt: string;
};
