"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StoryList } from "@/components/story/StoryList";
import { StoryView } from "@/components/story/StoryView";
import { StoryCreationForm } from "@/components/story/StoryCreationForm";
import { Button } from "@/components/ui/button";
import { useUserProfile, useUserStats } from "@/hooks/useApiAuthNew";
// import type { Story } from "@/lib/apiService";
import { Story } from "@/types";

type DashboardView = "list" | "create" | "view" | "edit";

export default function NewDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<DashboardView>("list");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { profile, loading: profileLoading } = useUserProfile();
  const { stats, loading: statsLoading } = useUserStats();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setCurrentView("view");
  };

  const handleCreateNew = () => {
    setSelectedStory(null);
    setCurrentView("create");
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentView("edit");
  };

  const handleBackToList = () => {
    setSelectedStory(null);
    setCurrentView("list");
  };

  const handleStoryCreated = (storyId: number) => {
    // Convert ID to story object for viewing - this is a placeholder
    // In a real implementation, you'd fetch the story details
    const newStory: Story = {
      id: storyId.toString(),
      userId: "",
      title: "New Story",
      content: "",
      status: "pending",
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedStory(newStory);
    setCurrentView("view");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.firstName || "Storyteller"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage your personalized stories
              </p>
            </div>

            {/* User Stats */}
            {!statsLoading && stats && (
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalStories}
                  </div>
                  <div className="text-gray-500">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.publishedStories}
                  </div>
                  <div className="text-gray-500">Published</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === "list" && (
          <StoryList
            onStorySelect={handleStorySelect}
            onCreateNew={handleCreateNew}
          />
        )}

        {currentView === "create" && (
          <div>
            <div className="flex items-center mb-6">
              <Button onClick={handleBackToList} variant="outline" size="sm">
                ← Back to Stories
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 ml-4">
                Create New Story
              </h2>
            </div>
            <StoryCreationForm
              onSuccess={handleStoryCreated}
              onCancel={handleBackToList}
            />
          </div>
        )}

        {currentView === "view" && selectedStory && (
          <StoryView
            storyId={selectedStory.id}
            onBack={handleBackToList}
            onEdit={handleEditStory}
          />
        )}

        {currentView === "edit" && selectedStory && (
          <div>
            <div className="flex items-center mb-6">
              <Button onClick={handleBackToList} variant="outline" size="sm">
                ← Back to Stories
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 ml-4">
                Edit Story
              </h2>
            </div>
            <StoryCreationForm
              onSuccess={handleStoryCreated}
              onCancel={handleBackToList}
            />
          </div>
        )}
      </div>

      {/* Profile Loading State */}
      {profileLoading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading profile...</span>
          </div>
        </div>
      )}
    </div>
  );
}
