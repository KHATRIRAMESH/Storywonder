"use client";

import { useStories } from "@/hooks/useStoryApiNew";
import { ApiUtils } from "@/lib";
import { Button } from "@/components/ui/button";
import { Story } from "@/types";
import Image from "next/image";

interface StoryListProps {
  onStorySelect?: (story: Story) => void;
  onCreateNew?: () => void;
}

export function StoryList({ onStorySelect, onCreateNew }: StoryListProps) {
  const { stories, loading, error, refetch } = useStories();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            No Stories Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first personalized story and watch the magic happen!
          </p>
          <Button onClick={onCreateNew}>Create Your First Story</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Stories</h2>
        <Button onClick={onCreateNew}>Create New Story</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onSelect={() => onStorySelect?.(story)}
          />
        ))}
      </div>
    </div>
  );
}

interface StoryCardProps {
  story: Story;
  onSelect: () => void;
}

function StoryCard({ story, onSelect }: StoryCardProps) {
  const statusColor = ApiUtils.getStoryStatusColor(story.status);
  const statusLabel = ApiUtils.getStoryStatusLabel(story.status);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Story Image */}
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
        {story.thumbnailUrl ? (
          <Image
            src={story.thumbnailUrl}
            alt={story.title}
            className="w-full h-full object-cover"
            width={800}
            height={400}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-6xl">📚</div>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
        >
          {statusLabel}
        </div>
      </div>

      {/* Story Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {story.title || "Untitled Story"}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {story.content || "Story content is being generated..."}
        </p>

        <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
          <span>Created: {new Date(story.createdAt).toLocaleDateString()}</span>
          {story.isPublic && <span className="text-green-600">Public</span>}
        </div>

        <Button
          onClick={onSelect}
          className="w-full"
          disabled={story.status === "generating"}
        >
          {story.status === "generating" ? "Generating..." : "Read Story"}
        </Button>
      </div>
    </div>
  );
}

// Loading skeleton component
export function StoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-300"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded mb-3"></div>
            <div className="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
