
import React from "react";
import { colors } from "../styles/commonStyles";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native";

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false, 
  children, 
  style, 
  textStyle 
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 12;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 16;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.backgroundAlt;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      case 'danger':
        baseStyle.backgroundColor = colors.danger;
        break;
      default: // primary
        baseStyle.backgroundColor = colors.primary;
        break;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.color = colors.text;
        break;
      default: // primary, danger
        baseStyle.color = 'white';
        break;
    }

    return baseStyle;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' ? colors.primary : 'white'} 
          style={{ marginRight: 8 }} 
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}

export default Button;
