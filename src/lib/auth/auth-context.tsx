// ProjectX OS - Auth Context & RBAC
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, Permission } from '@/lib/domain/types';
import { ROLE_PERMISSIONS } from '@/lib/domain/types';
import { currentUserStore, usersStore, initializeMockData } from '@/lib/domain/store';

// =============================================================================
// TYPES
// =============================================================================

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Role & Permissions
  role: UserRole | null;
  hasPermission: (permission: Permission) => boolean;
  
  // Actions
  login: (userId: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void; // Dev only
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize on mount
  useEffect(() => {
    initializeMockData();
    
    const storedUser = currentUserStore.get();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);
  
  // Login
  const login = useCallback((userId: string) => {
    const foundUser = usersStore.getById(userId);
    if (foundUser) {
      setUser(foundUser);
      currentUserStore.set(foundUser);
    }
  }, []);
  
  // Logout
  const logout = useCallback(() => {
    setUser(null);
    currentUserStore.set(null);
  }, []);
  
  // Switch role (dev only)
  const switchRole = useCallback((role: UserRole) => {
    const users = usersStore.getByRole(role);
    if (users.length > 0) {
      setUser(users[0]);
      currentUserStore.set(users[0]);
    }
  }, []);
  
  // Check permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  }, [user]);
  
  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role || null,
    hasPermission,
    login,
    logout,
    switchRole,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

export function useRequireAuth(): AuthContextValue {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login or landing
      window.location.href = '/';
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  
  return auth;
}

export function useRequireRole(allowedRoles: UserRole[]): AuthContextValue {
  const auth = useRequireAuth();
  
  useEffect(() => {
    if (!auth.isLoading && auth.role && !allowedRoles.includes(auth.role)) {
      // Redirect to unauthorized
      window.location.href = '/unauthorized';
    }
  }, [auth.isLoading, auth.role, allowedRoles]);
  
  return auth;
}
