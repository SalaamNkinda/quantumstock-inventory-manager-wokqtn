
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types/inventory';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@quantumstock.com',
    name: 'John Admin',
    role: 'Administrator',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'manager@quantumstock.com',
    name: 'Sarah Manager',
    role: 'Manager',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'clerk@quantumstock.com',
    name: 'Mike Clerk',
    role: 'Warehouse Clerk',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Attempting login for:', email);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      setIsLoading(false);
      console.log('Login successful for:', foundUser.name);
      return true;
    }
    
    setIsLoading(false);
    console.log('Login failed for:', email);
    return false;
  };

  const logout = () => {
    console.log('User logged out');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
