'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { ExtendedUser } from '@/types';

export function useAuth() {
  const { user, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Check if user is a backend user (stored in localStorage)
  const isBackendUser = typeof window !== 'undefined' ? !!localStorage.getItem("backendUser") : false;

  const handleSignOut = async () => {
    if (isBackendUser) {
      // Handle backend user signout
      localStorage.removeItem("backendUser");
      // You might want to call a custom signout function here
    } else {
      await clerkSignOut();
    }
  };

  return {
    user: user as ExtendedUser,
    isSignedIn,
    isBackendUser,
    signOut: handleSignOut,
  };
}
