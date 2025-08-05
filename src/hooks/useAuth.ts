'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const context = useAuthContext();
  
  return {
    // Current Passport.js backend authentication properties
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    register: context.register,
    logout: context.logout,
    refreshUser: context.refreshUser,
    
    // Legacy aliases for backward compatibility with Clerk-based components
    isSignedIn: context.isAuthenticated,
    signOut: context.logout,
    
    // Additional backward compatibility properties
    isLoaded: !context.isLoading,
  };
}
