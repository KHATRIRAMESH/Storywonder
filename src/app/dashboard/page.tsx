'use client';

import { useApiData } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useBackendProfile, useUserStats, useAuthVerification } from '@/hooks/useAuthenticatedFetch';
import { Loader2, BookOpen, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { isSignedIn } = useAuth();
  const { authStatus, loading: authLoading, error: authError } = useAuthVerification();
  const { profile, loading: profileLoading, error: profileError } = useBackendProfile();
  const { stats, loading: statsLoading, error: statsError } = useUserStats();
  
  // Only load stories if backend authentication is successful
  const shouldLoadStories = isSignedIn && !authError && !profileError && authStatus;
  const { data: stories, loading: storiesLoading, error: storiesError } = useApiData<Story[]>(
    shouldLoadStories ? '/api/stories' : ''
  );

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if backend connection fails
  if (authError || profileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Backend Connection Error
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the backend server. Please make sure your backend is running on port 8000.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {authError || profileError}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Backend Connection Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-700">Connected to backend server</span>
          {authStatus && (
            <span className="text-gray-500">
              • User ID: {authStatus.userId}
            </span>
          )}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600">
          Manage your stories and create new magical adventures.
        </p>
        {profile && (
          <div className="mt-2 text-sm text-gray-500">
            Member since: {new Date(profile.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stories Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {profileLoading || statsLoading ? '...' : stats?.storiesGenerated || profile?.storiesGenerated || 0}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Subscription</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {profile?.subscriptionLevel || stats?.subscriptionLevel || 'Free'}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full ${
              (profile?.subscriptionLevel === 'premium' || stats?.subscriptionLevel === 'premium') 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : (profile?.subscriptionLevel === 'pro' || stats?.subscriptionLevel === 'pro')
                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                : 'bg-gray-300'
            }`}></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stories Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.subscriptionFeatures?.storiesPerMonth || 'Unlimited'}
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stats?.hasReachedStoryLimit ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <span className={`font-bold text-sm ${
                stats?.hasReachedStoryLimit ? 'text-red-600' : 'text-green-600'
              }`}>
                {stats?.hasReachedStoryLimit ? '!' : '✓'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Backend Status</p>
              <p className="text-lg font-bold text-green-600">Connected</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Error Display for Stories */}
      {(statsError || storiesError) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            <strong>Warning:</strong> Some data couldn&apos;t be loaded from the backend.
            {statsError && <span className="block">Stats: {statsError}</span>}
            {storiesError && <span className="block">Stories: {storiesError}</span>}
          </p>
        </div>
      )}

      {/* Stories Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Stories</h2>
            <Link href="/create-story">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={stats?.hasReachedStoryLimit}
              >
                <Plus className="w-4 h-4 mr-2" />
                {stats?.hasReachedStoryLimit ? 'Limit Reached' : 'Create New Story'}
              </Button>
            </Link>
          </div>
          {stats?.hasReachedStoryLimit && (
            <p className="text-sm text-red-600 mt-2">
              You&apos;ve reached your monthly story limit. Upgrade your plan to create more stories.
            </p>
          )}
        </div>

        <div className="p-6">
          {storiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading your stories...</span>
            </div>
          ) : storiesError ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Unable to load stories from the backend server.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : !stories || stories.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No stories yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first magical story to get started!
              </p>
              <Link href="/create-story">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={stats?.hasReachedStoryLimit}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Story
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {story.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Created: {new Date(story.createdAt).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
