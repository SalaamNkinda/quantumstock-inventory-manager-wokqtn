
import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/button';
import { useAuth } from '../../contexts/AuthContext';
import { BodyScrollView } from '../../components/BodyScrollView';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    console.log('Attempting login...');
    const success = await login(email, password);
    
    if (success) {
      router.replace('/(tabs)/dashboard');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Try:\n\nAdmin: admin@quantumstock.com\nManager: manager@quantumstock.com\nClerk: clerk@quantumstock.com\n\nPassword: password123');
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'manager' | 'clerk') => {
    const credentials = {
      admin: 'admin@quantumstock.com',
      manager: 'manager@quantumstock.com',
      clerk: 'clerk@quantumstock.com',
    };
    
    setEmail(credentials[role]);
    setPassword('password123');
    setErrors({});
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.wrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BodyScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[commonStyles.container, { justifyContent: 'center', paddingHorizontal: 24 }]}>
          <View style={{ width: '100%', maxWidth: 400 }}>
            <View style={{ alignItems: 'center', marginBottom: 48 }}>
              <Text style={[commonStyles.title, { fontSize: 32, color: colors.primary }]}>
                QuantumStock
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Professional Inventory Management System
              </Text>
            </View>

            <View style={{ marginBottom: 32 }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <Button
                onPress={handleLogin}
                loading={isLoading}
                style={{ marginTop: 8 }}
              >
                Sign In
              </Button>
            </View>

            <View style={commonStyles.divider} />

            <View style={{ marginTop: 24 }}>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 16 }]}>
                Demo Accounts
              </Text>
              
              <View style={{ gap: 8 }}>
                <Button
                  variant="secondary"
                  onPress={() => fillDemoCredentials('admin')}
                  style={{ marginBottom: 4 }}
                >
                  Administrator Demo
                </Button>
                
                <Button
                  variant="secondary"
                  onPress={() => fillDemoCredentials('manager')}
                  style={{ marginBottom: 4 }}
                >
                  Manager Demo
                </Button>
                
                <Button
                  variant="secondary"
                  onPress={() => fillDemoCredentials('clerk')}
                >
                  Warehouse Clerk Demo
                </Button>
              </View>
            </View>
          </View>
        </View>
      </BodyScrollView>
    </KeyboardAvoidingView>
  );
}
