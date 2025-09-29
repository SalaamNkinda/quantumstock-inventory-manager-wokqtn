
import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="cube" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: 'Movements',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="activity" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
