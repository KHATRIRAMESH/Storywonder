'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';

// Custom hook for making authenticated API calls to your backend
export function useAuthenticatedFetch() {
  const { getToken } = useAuth();

  const authenticatedFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = await getToken();
      return await apiCall(endpoint, options, token || undefined);
    } catch (error) {
      console.error('Authenticated API call failed:', error);
      throw error;
    }
  }, [getToken]);

  return authenticatedFetch;
}

// Hook for verifying authentication with backend
export function useAuthVerification() {
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean;
    userId?: string;
    email?: string;
    subscriptionLevel?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await authenticatedFetch('/api/auth/verify');
        setAuthStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth verification failed');
        setAuthStatus(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [authenticatedFetch]);

  return { authStatus, loading, error, refetch: () => setLoading(true) };
}

// Hook for user profile from backend
export function useBackendProfile() {
  const [profile, setProfile] = useState<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    subscriptionLevel: string;
    storiesGenerated: number;
    createdAt: string;
    updatedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authenticatedFetch('/api/auth/profile');
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }) => {
    try {
      const response = await authenticatedFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      setProfile(response);
      return response;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

// Hook for user subscription info
export function useSubscription() {
  const [subscription, setSubscription] = useState<{
    level: string;
    features: {
      storiesPerMonth: number;
      maxPages: number;
      customCharacters: boolean;
      pdfDownload: boolean;
      support: string;
    };
    storiesGenerated: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await authenticatedFetch('/api/auth/subscription');
        setSubscription(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [authenticatedFetch]);

  return { subscription, loading, error };
}

// Hook for user statistics
export function useUserStats() {
  const [stats, setStats] = useState<{
    storiesGenerated: number;
    subscriptionLevel: string;
    subscriptionFeatures: {
      storiesPerMonth: number;
      maxPages: number;
      customCharacters: boolean;
      pdfDownload: boolean;
      support: string;
    };
    hasReachedStoryLimit: boolean;
    memberSince: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authenticatedFetch('/api/auth/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
