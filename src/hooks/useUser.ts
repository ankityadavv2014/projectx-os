"use client";

import { useState, useEffect, useCallback } from "react";
import {
  currentUserStore,
  usersStore,
} from "@/lib/domain/store";
import type { User, UserRole } from "@/lib/domain/types";

// =============================================================================
// USE CURRENT USER
// =============================================================================

interface UseCurrentUserReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refresh: () => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(() => {
    const currentUser = currentUserStore.get();
    setUserState(currentUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const setUser = useCallback((newUser: User | null) => {
    currentUserStore.set(newUser);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    currentUserStore.set(null);
    setUserState(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = usersStore.update(user.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    if (updated) {
      currentUserStore.set(updated);
      setUserState(updated);
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
    updateProfile,
    refresh: loadUser,
  };
}

// =============================================================================
// USE USERS
// =============================================================================

interface UseUsersOptions {
  role?: UserRole;
  cohortId?: string;
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  getById: (id: string) => User | null;
  refresh: () => void;
}

export function useUsers(options?: UseUsersOptions): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    let result = usersStore.getAll();
    
    if (options?.role) {
      result = result.filter(u => u.role === options.role);
    }
    
    if (options?.cohortId) {
      result = result.filter(u => u.cohortIds.includes(options.cohortId!));
    }
    
    setUsers(result);
    setIsLoading(false);
  }, [options?.role, options?.cohortId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const getById = useCallback((id: string) => {
    return usersStore.getById(id);
  }, []);

  return {
    users,
    isLoading,
    getById,
    refresh: loadUsers,
  };
}

// =============================================================================
// USE ROLE CHECK
// =============================================================================

export function useRoleCheck() {
  const { user } = useCurrentUser();

  const is = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isParent = user?.role === "parent";
  const isAdmin = user?.role === "admin";
  const isFacilitator = user?.role === "facilitator";
  const isStaff = isTeacher || isAdmin || isFacilitator;

  return {
    is,
    isStudent,
    isTeacher,
    isParent,
    isAdmin,
    isFacilitator,
    isStaff,
    role: user?.role,
  };
}

// =============================================================================
// USE USER BY ID
// =============================================================================

export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const found = usersStore.getById(userId);
    setUser(found);
    setIsLoading(false);
  }, [userId]);

  return { user, isLoading };
}
