import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from '@/api/firebase';
import type { ReviewItem, ReviewPayload, ReviewSummary } from '@/components/reviews/types';

const REVIEWS_COLLECTION = 'reviews';
const AVATAR_COLORS = ['#D8E8F7', '#E6D9F7', '#D5F0E3', '#F7DDE5', '#F7E5C9'];

type ReviewDocument = {
  userName?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

function getAvatarLabel(userName: string) {
  const parts = userName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'GU';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function getAvatarColor(id: string) {
  const hash = id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function mapReviewDocument(doc: QueryDocumentSnapshot<ReviewDocument>): ReviewItem {
  const data = doc.data();
  const userName = data.userName?.trim() || 'Guest User';

  return {
    id: doc.id,
    userName,
    rating: Math.max(0, Math.min(5, data.rating ?? 0)),
    comment: data.comment?.trim() ?? '',
    createdAt: data.createdAt ?? new Date(0).toISOString(),
    avatarColor: getAvatarColor(doc.id),
    avatarLabel: getAvatarLabel(userName),
  };
}

export async function getReviews() {
  const reviewsQuery = query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(reviewsQuery);

  return snapshot.docs.map(mapReviewDocument);
}

export async function createReview(payload: ReviewPayload) {
  const reviewToCreate: Required<ReviewPayload> = {
    userName: payload.userName?.trim() || 'Guest User',
    rating: payload.rating,
    comment: payload.comment.trim(),
    createdAt: payload.createdAt,
  };

  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewToCreate);

  return {
    id: docRef.id,
    ...reviewToCreate,
    avatarColor: getAvatarColor(docRef.id),
    avatarLabel: getAvatarLabel(reviewToCreate.userName),
  } satisfies ReviewItem;
}

export function getReviewSummary(reviews: ReviewItem[]): ReviewSummary {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalStars: 5,
      headline: 'no reviews yet',
    };
  }

  const average = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const averageRating = Math.round(average);

  return {
    averageRating,
    totalStars: 5,
    headline: averageRating >= 4 ? 'great' : averageRating >= 3 ? 'good' : 'fair',
  };
}
