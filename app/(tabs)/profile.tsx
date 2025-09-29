
import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/button';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator':
        return colors.danger;
      case 'Manager':
        return colors.primary;
      case 'Warehouse Clerk':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'Administrator':
        return [
          'Full CRUD access to all data',
          'User account management',
          'System settings access',
          'All reporting features',
        ];
      case 'Manager':
        return [
          'CRUD access to inventory',
          'Stock movement logging',
          'Reporting and analytics',
          'No user management',
        ];
      case 'Warehouse Clerk':
        return [
          'Read inventory data',
          'Log stock movements',
          'Initiate replenishment requests',
          'Limited access to reports',
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Text style={commonStyles.text}>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={{ paddingTop: 16, marginBottom: 24 }}>
          <Text style={commonStyles.title}>Profile</Text>
          <Text style={commonStyles.textSecondary}>
            Account information and settings
          </Text>
        </View>

        {/* User Info Card */}
        <Card style={{ marginBottom: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getRoleColor(user.role) + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <IconSymbol name="person" size={40} color={getRoleColor(user.role)} />
            </View>
            <Text style={[commonStyles.subtitle, { textAlign: 'center', marginBottom: 4 }]}>
              {user.name}
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
              {user.email}
            </Text>
            <Badge variant={user.role === 'Administrator' ? 'danger' : user.role === 'Manager' ? 'default' : 'success'}>
              {user.role}
            </Badge>
          </View>

          <View style={commonStyles.divider} />

          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>User ID</Text>
            <Text style={commonStyles.text}>{user.id}</Text>
          </View>
          
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Member Since</Text>
            <Text style={commonStyles.text}>
              {user.createdAt.toLocaleDateString()}
            </Text>
          </View>
        </Card>

        {/* Role Permissions */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Role Permissions
          </Text>
          {getRolePermissions(user.role).map((permission, index) => (
            <View key={index} style={[commonStyles.row, { marginBottom: 8, alignItems: 'flex-start' }]}>
              <IconSymbol name="checkmark" size={16} color={colors.success} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={[commonStyles.text, { flex: 1 }]}>{permission}</Text>
            </View>
          ))}
        </Card>

        {/* App Info */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Application Info
          </Text>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>App Name</Text>
            <Text style={commonStyles.text}>QuantumStock</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Version</Text>
            <Text style={commonStyles.text}>1.0.0</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Platform</Text>
            <Text style={commonStyles.text}>React Native + Expo</Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={{ marginBottom: 32 }}>
          <Button
            variant="secondary"
            onPress={() => Alert.alert('Settings', 'Settings feature coming soon!')}
            style={{ marginBottom: 12 }}
          >
            Settings
          </Button>
          
          <Button
            variant="secondary"
            onPress={() => Alert.alert('Help', 'Help & Support feature coming soon!')}
            style={{ marginBottom: 12 }}
          >
            Help & Support
          </Button>
          
          <Button
            onPress={handleLogout}
            style={{ backgroundColor: colors.danger }}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
