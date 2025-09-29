
import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'default';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return commonStyles.badgeSuccess;
      case 'warning':
        return commonStyles.badgeWarning;
      case 'danger':
        return commonStyles.badgeDanger;
      default:
        return commonStyles.badge;
    }
  };

  return (
    <View style={[commonStyles.badge, getBadgeStyle(), style]}>
      <Text style={[getBadgeStyle(), textStyle]}>{children}</Text>
    </View>
  );
}
