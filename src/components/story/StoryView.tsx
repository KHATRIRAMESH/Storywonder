"use client";

import { useStory } from "@/hooks/useStoryApiNew";
import { Button } from "@/components/ui/button";
import { ApiUtils } from "@/lib";
// import type { Story } from "@/lib/apiService";
import { Story } from "@/types";
import Image from "next/image";

interface StoryViewProps {
  storyId: string;
  onBack?: () => void;
  onEdit?: (story: Story) => void;
}

export function StoryView({ storyId, onBack, onEdit }: StoryViewProps) {
  const { story, loading, error, refetch } = useStory(storyId);

  console.log("story content", story?.content);

  if (loading) {
    return <StoryViewSkeleton />;
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error || "Story not found"}</p>
          </div>
          <div className="space-x-3">
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
            <Button onClick={onBack} variant="outline">
              Back to Stories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = ApiUtils.getStoryStatusColor(story.status);
  const statusLabel = ApiUtils.getStoryStatusLabel(story.status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <Button onClick={onBack} variant="outline" size="sm">
                ← Back
              </Button>
            )}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
            >
              {statusLabel}
            </div>
            {story.isPublic && (
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Public
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {story.title || "Untitled Story"}
          </h1>
          <p className="text-gray-600">
            Created on {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>

        {onEdit && (
          <Button onClick={() => onEdit(story)} variant="outline">
            Edit Story
          </Button>
        )}
      </div>

      {/* Story Image */}
      {story.thumbnailUrl && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={story.thumbnailUrl}
            alt={story.title || "Story illustration"}
            className="w-full h-64 md:h-80 object-cover"
            width={800}
            height={400}
          />
        </div>
      )}

      {/* Story Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        {story.status === "generating" ? (
          <GeneratingContent />
        ) : story.content ? (
          <div className="prose prose-lg max-w-none">
            <StoryContent content={story.content} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>This story doesn&apos;t have any content yet.</p>
          </div>
        )}
      </div>

      {/* Story Metadata */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Story Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Status:</span>
            <span className="ml-2 font-medium">{statusLabel}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 font-medium">
              {new Date(story.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Visibility:</span>
            <span className="ml-2 font-medium">
              {story.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Story ID:</span>
            <span className="ml-2 font-mono text-xs">{story.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratingContent() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Creating Your Story...
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Our AI is crafting a personalized story just for you. This usually takes
        1-2 minutes.
      </p>
    </div>
  );
}

interface StoryContentProps {
  content: string;
}

function StoryContent({ content }: StoryContentProps) {
  // Split content into paragraphs and render them nicely
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-gray-800 leading-relaxed">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  );
}

export function StoryViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-16 bg-gray-300 rounded"></div>
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-8 w-96 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Image skeleton */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <div className="w-full h-64 md:h-80 bg-gray-300"></div>
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
