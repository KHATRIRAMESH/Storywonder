"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/lib/apiService";
import { UserProfile, UserStats, UserSubscription } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Hook for user profile data
export function useUserProfile() {
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData = await apiService.getUserProfile();
      setProfile(profileData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch profile");
        console.error("Failed to fetch profile:", err);
      } else {
        setError("Failed to fetch profile");
        console.error("Failed to fetch profile:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated, user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await apiService.updateUserProfile(updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update profile");
      } else {
        setError("Failed to update profile");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}

// Hook for user statistics
export function useUserStats() {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!isAuthenticated) {
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const statsData = await apiService.getUserStats();
      setStats(statsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch stats");
        console.error("Failed to fetch stats:", err);
      } else {
        setError("Failed to fetch stats");
        console.error("Failed to fetch stats:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAuthenticated, user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

// Hook for user subscription
export function useUserSubscription() {
  const { isAuthenticated, user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subscriptionData = await apiService.getUserSubscription();
      setSubscription(subscriptionData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch subscription");
        console.error("Failed to fetch subscription:", err);
      } else {
        setError("Failed to fetch subscription");
        console.error("Failed to fetch subscription:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}

// Authentication hook wrapper that provides auth state and actions
export function useAuthApi() {
  const auth = useAuth();

  return {
    ...auth,
    // Additional convenience methods
    isReady: !auth.isLoading,
  };
}
