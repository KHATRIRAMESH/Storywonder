'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useBackendProfile, useUserStats, useAuthVerification } from '@/hooks/useAuthenticatedFetch';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowLeft, AlertTriangle, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CreateStory() {
  const { isSignedIn } = useAuth();
  const { loading: authLoading, error: authError } = useAuthVerification();
  const { profile, loading: profileLoading, error: profileError } = useBackendProfile();
  const { stats, loading: statsLoading, error: statsError } = useUserStats();
  const { mutate, loading, error } = useApiMutation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    childName: '',
    age: '',
    interests: '',
    theme: 'adventure',
    length: 'short',
  });

  const [generatedStory, setGeneratedStory] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to create stories.</p>
          <Link href="/sign-in">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (authLoading || profileLoading || statsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading story creation interface...</p>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached their story limit
    if (stats?.hasReachedStoryLimit) {
      return;
    }
    
    try {
      const story = await mutate('/api/stories', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      setGeneratedStory(story);
      
      // Optionally redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (err) {
      console.error('Failed to create story:', err);
    }
  };

  if (generatedStory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Story Created Successfully! ✨
          </h1>
          <p className="text-gray-600">
            Your magical story has been generated and saved.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {generatedStory.title}
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {generatedStory.content}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline"
            onClick={() => {
              setGeneratedStory(null);
              setFormData({
                title: '',
                childName: '',
                age: '',
                interests: '',
                theme: 'adventure',
                length: 'short',
              });
            }}
            disabled={stats?.hasReachedStoryLimit}
          >
            {stats?.hasReachedStoryLimit ? 'Limit Reached' : 'Create Another Story'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Story
        </h1>
        <p className="text-gray-600">
          Tell us about the story you&apos;d like to create, and our AI will craft a magical adventure!
        </p>
      </div>

      {/* Subscription Status */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                profile?.subscriptionLevel === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                profile?.subscriptionLevel === 'pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' :
                'bg-gray-100'
              }`}>
                {profile?.subscriptionLevel === 'premium' ? <Crown className="w-4 h-4 text-white" /> :
                 profile?.subscriptionLevel === 'pro' ? <Zap className="w-4 h-4 text-white" /> :
                 <Sparkles className="w-4 h-4 text-gray-600" />}
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {profile?.subscriptionLevel || 'Free'} Plan
                </p>
                <p className="text-sm text-gray-600">
                  {stats?.subscriptionFeatures?.storiesPerMonth === -1
                    ? 'Unlimited stories per month'
                    : `${stats?.subscriptionFeatures?.storiesPerMonth || 5} stories per month`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stories used this month</p>
              <p className={`font-bold ${stats?.hasReachedStoryLimit ? 'text-red-600' : 'text-green-600'}`}>
                {stats?.storiesGenerated || profile?.storiesGenerated || 0}
                {stats?.subscriptionFeatures?.storiesPerMonth !== -1 && 
                  ` / ${stats?.subscriptionFeatures?.storiesPerMonth || 5}`
                }
              </p>
            </div>
          </div>
          
          {stats?.hasReachedStoryLimit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                <strong>Story limit reached!</strong> You&apos;ve used all your stories for this month. 
                Upgrade your plan to create more stories.
              </p>
              <Button className="mt-2" size="sm">
                Upgrade Plan
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Show warning if stats couldn't be loaded */}
      {statsError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-sm">
            <strong>Warning:</strong> Unable to load subscription information from backend. 
            Story limits may not be enforced properly.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Story Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a title for your story..."
              required
              disabled={stats?.hasReachedStoryLimit}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                Child&apos;s Name
              </label>
              <input
                type="text"
                id="childName"
                name="childName"
                value={formData.childName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Main character's name..."
                required
                disabled={stats?.hasReachedStoryLimit}
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Age..."
                min="3"
                max="18"
                required
                disabled={stats?.hasReachedStoryLimit}
              />
            </div>
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
              Interests & Hobbies
            </label>
            <textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What does the child love? (animals, sports, music, etc.)"
              required
              disabled={stats?.hasReachedStoryLimit}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Story Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={stats?.hasReachedStoryLimit}
              >
                <option value="adventure">Adventure</option>
                <option value="friendship">Friendship</option>
                <option value="magic">Magic & Fantasy</option>
                <option value="mystery">Mystery</option>
                <option value="animals">Animals</option>
                <option value="space">Space & Science</option>
                <option value="fairy-tale">Fairy Tale</option>
              </select>
            </div>

            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                Story Length
              </label>
              <select
                id="length"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={stats?.hasReachedStoryLimit}
              >
                <option value="short">Short (2-3 minutes)</option>
                <option value="medium">Medium (5-7 minutes)</option>
                <option value="long">Long (10+ minutes)</option>
              </select>
            </div>
          </div>

          {(error || (stats?.hasReachedStoryLimit && !error)) && (
            <div className={`p-4 border rounded-lg ${
              stats?.hasReachedStoryLimit 
                ? 'bg-red-50 border-red-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className="text-red-600 text-sm">
                {stats?.hasReachedStoryLimit 
                  ? 'You have reached your monthly story limit. Please upgrade your plan to create more stories.'
                  : error?.includes('Failed to fetch') 
                    ? 'Unable to connect to the server. Please check if your backend server is running.'
                    : error
                }
              </p>
              {stats?.hasReachedStoryLimit && (
                <Button className="mt-2" size="sm">
                  Upgrade Plan
                </Button>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || stats?.hasReachedStoryLimit}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Story...
              </>
            ) : stats?.hasReachedStoryLimit ? (
              'Story Limit Reached'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Story
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>✨ Our AI will create a personalized story just for you!</p>
      </div>
    </div>
  );
}
