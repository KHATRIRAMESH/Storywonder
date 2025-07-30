'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { apiCall } from '@/lib/api';

// Hook for making authenticated API calls
export function useApiCall() {
  const { getToken } = useAuth();

  const apiCallWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    try {
      const token = await getToken();
      return await apiCall(endpoint, options, token || undefined);
    } catch (error) {
      console.error('Authenticated API call failed:', error);
      throw error;
    }
  };

  return { apiCall: apiCallWithAuth };
}

// Hook for fetching data from your API server
export function useApiData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall: apiCallWithAuth } = useApiCall();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCallWithAuth(endpoint);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, apiCallWithAuth]);

  const refetch = () => {
    setLoading(true);
    // Re-trigger the useEffect by updating a state
  };

  return { data, loading, error, refetch };
}

// Hook for making mutations (POST, PUT, DELETE)
export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiCall: apiCallWithAuth } = useApiCall();

  const mutate = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCallWithAuth(endpoint, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
