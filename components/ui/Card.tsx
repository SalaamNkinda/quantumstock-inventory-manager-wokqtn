
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[commonStyles.card, style]}>
      {children}
    </View>
  );
}
