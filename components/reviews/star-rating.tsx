import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function StarRating({
  rating,
  totalStars = 5,
  size = 18,
  emptyColor = '#D3D3D3',
  filledColor = '#FFB33E',
  gap = 2,
  onSelect,
}: {
  rating: number;
  totalStars?: number;
  size?: number;
  emptyColor?: string;
  filledColor?: string;
  gap?: number;
  onSelect?: (value: number) => void;
}) {
  const renderStarIcon = (starValue: number, filled: boolean) => (
    <Ionicons
      key={starValue}
      name="star"
      size={size}
      color={filled ? filledColor : emptyColor}
    />
  );

  return (
    <View style={[styles.starsRow, { gap }]}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;

        if (onSelect) {
          return (
            <TouchableOpacity
              key={starValue}
              accessibilityRole="button"
              style={styles.starButton}
              onPress={() => onSelect(starValue)}>
              {renderStarIcon(starValue, filled)}
            </TouchableOpacity>
          );
        }

        return renderStarIcon(starValue, filled);
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 2,
  },
});
