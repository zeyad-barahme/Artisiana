import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import ReviewScreenHeader from '@/components/reviews/review-screen-header';
import ReviewScreenShell from '@/components/reviews/review-screen-shell';
import StarRating from '@/components/reviews/star-rating';
import type { AddReviewForm, ReviewPayload } from '@/components/reviews/types';
import { createReview } from '@/services/reviews/reviews.service';

const initialFormState: AddReviewForm = {
  rating: 0,
  comment: '',
};

export default function AddReview() {
  const router = useRouter();
  const [form, setForm] = useState<AddReviewForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeRating = (rating: number) => {
    setForm((current) => ({ ...current, rating }));
  };

  const handleChangeComment = (comment: string) => {
    setForm((current) => ({ ...current, comment }));
  };

  const handleSubmit = async () => {
    if (form.rating === 0) {
      Alert.alert('Rating required', 'Please choose a rating before submitting your review.');
      return;
    }

    const payload: ReviewPayload = {
      userName: 'Guest User',
      rating: form.rating,
      comment: form.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      await createReview(payload);
      setForm(initialFormState);
      Alert.alert('Review submitted', 'Your review was saved successfully.', [
        {
          text: 'OK',
          onPress: () => router.replace('/Reviews/Reviews'),
        },
      ]);
    } catch {
      Alert.alert('Submission failed', 'Could not save the review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReviewScreenShell centered>
      <ReviewScreenHeader />

      <Text style={styles.title}>Add Review</Text>
      <Text style={styles.subtitle}>Rate this product</Text>

      <StarRating
        rating={form.rating}
        size={34}
        gap={8}
        emptyColor="#E1E1E1"
        onSelect={handleChangeRating}
      />

      <TextInput
        value={form.comment}
        onChangeText={handleChangeComment}
        placeholder="Write your review..."
        placeholderTextColor="#C5C5C5"
        multiline
        textAlignVertical="top"
        style={styles.input}
      />

      <TouchableOpacity
        accessibilityRole="button"
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        <Text style={styles.submitButtonText}>{isSubmitting ? 'saving...' : 'submit'}</Text>
      </TouchableOpacity>
    </ReviewScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 54,
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
  },
  subtitle: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: '600',
    color: '#222222',
  },
  input: {
    width: '88%',
    minHeight: 112,
    marginTop: 28,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F6F6F6',
    fontSize: 16,
    color: '#333333',
  },
  submitButton: {
    marginTop: 'auto',
    marginBottom: 72,
    minWidth: 126,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 26,
    paddingVertical: 12,
    backgroundColor: '#FF8354',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'lowercase',
  },
});
