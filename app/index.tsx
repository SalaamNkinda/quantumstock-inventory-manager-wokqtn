
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { commonStyles } from '../styles/commonStyles';

export default function IndexScreen() {
  const { user } = useAuth();

  // Show loading state briefly
  if (user === undefined) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status
  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
