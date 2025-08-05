'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SSOCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Check for error parameters
      const error = searchParams.get('error');
      if (error) {
        setStatus('error');
        setMessage(getErrorMessage(error));
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
        return;
      }

      // Check if there's an auth token in cookies (set by backend)
      const cookies = document.cookie.split(';');
      const authToken = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
      
      if (authToken) {
        // Token found in cookie, refresh user data
        await refreshUser();
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard-new');
        }, 1000);
      } else {
        // No token found
        setStatus('error');
        setMessage('Authentication failed. No token received.');
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      }
    } catch (error) {
      console.error('SSO callback error:', error);
      setStatus('error');
      setMessage('Authentication failed. Please try again.');
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'oauth_failed':
        return 'OAuth authentication failed. Please try again.';
      case 'session_failed':
        return 'Failed to create session. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Completing Sign In
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.push('/sign-in')}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Return to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
