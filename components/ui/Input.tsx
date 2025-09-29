
import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={[commonStyles.textSecondary, { marginBottom: 4, fontWeight: '500' }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          commonStyles.input,
          isFocused && commonStyles.inputFocused,
          error && { borderColor: colors.danger },
          style,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text style={[commonStyles.textSecondary, { color: colors.danger, marginTop: 4 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
