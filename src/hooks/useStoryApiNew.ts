"use client";

import { useState, useEffect, useCallback } from "react";
import { apiService } from "@/lib/apiService";
import { Story, StoryCreationData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Hook for fetching user stories
export function useStories() {
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    if (!isAuthenticated) {
      setStories([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storiesData = await apiService.getStories();
      setStories(storiesData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stories";
      setError(errorMessage);
      console.error("Failed to fetch stories:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  console.log("StoryList component loaded", { stories, loading, error });
  return {
    stories,
    loading,
    error,
    refetch: fetchStories,
  };
}

// Hook for fetching a single story
export function useStory(storyId: string) {
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async () => {
    if (!isAuthenticated || !storyId) {
      setStory(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storyData = await apiService.getStory(storyId);
      setStory(storyData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch story";
      setError(errorMessage);
      console.error("Failed to fetch story:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, storyId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  return {
    story,
    loading,
    error,
    refetch: fetchStory,
  };
}

// Hook for story creation
export function useStoryCreation() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStory = async (data: StoryCreationData): Promise<Story> => {
    setCreating(true);
    setError(null);

    try {
      const story = await apiService.createStory(data);
      return story;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create story";
      setError(errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const updateStory = async (
    storyId: string,
    data: Partial<StoryCreationData>
  ): Promise<Story> => {
    setCreating(true);
    setError(null);

    try {
      const story = await apiService.updateStory(storyId, data);
      return story;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update story";
      setError(errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    error,
    createStory,
    updateStory,
  };
}

// Hook for polling story status during generation
export function useStoryStatusPolling(
  storyId: string,
  enabled: boolean = true
) {
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [polling, setPolling] = useState(false);

  const pollStoryStatus = useCallback(async () => {
    if (!isAuthenticated || !storyId || !enabled) return;

    try {
      const storyData = await apiService.getStory(storyId);
      setStory(storyData);

      // Stop polling if story is completed or failed
      if (storyData.status === "completed" || storyData.status === "failed") {
        setPolling(false);
        return;
      }

      // Continue polling if still generating
      if (storyData.status === "generating" || storyData.status === "pending") {
        setPolling(true);
        setTimeout(pollStoryStatus, 3000); // Poll every 3 seconds
      }
    } catch (err: unknown) {
      console.error("Failed to poll story status:", err);
      setPolling(false);
    }
  }, [isAuthenticated, storyId, enabled]);

  useEffect(() => {
    if (enabled && storyId) {
      pollStoryStatus();
    }
  }, [enabled, storyId, pollStoryStatus]);

  const startPolling = () => {
    setPolling(true);
    pollStoryStatus();
  };

  const stopPolling = () => {
    setPolling(false);
  };

  return {
    story,
    polling,
    startPolling,
    stopPolling,
  };
}

// Hook for story deletion
export function useStoryDeletion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStory = useCallback(async (storyId: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiService.deleteStory(storyId);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete story";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteStory,
    loading,
    error,
  };
}

// Hook for story creation options/configuration
export function useStoryOptions() {
  return {
    themes: [
      "Adventure",
      "Fantasy",
      "Science Fiction",
      "Mystery",
      "Friendship",
      "Animals",
      "Space",
      "Underwater",
      "Fairy Tale",
      "Superhero",
      "Educational",
      "Holiday",
      "Family",
      "Nature",
      "Magic",
    ],
    storyLengths: [
      { value: "short", label: "Short (3-5 pages)", pages: "3-5" },
      { value: "medium", label: "Medium (6-10 pages)", pages: "6-10" },
      { value: "long", label: "Long (11-15 pages)", pages: "11-15" },
    ],
    genderOptions: [
      { value: "boy", label: "Boy" },
      { value: "girl", label: "Girl" },
      { value: "other", label: "Other" },
    ],
    interestSuggestions: [
      "Animals",
      "Sports",
      "Music",
      "Art",
      "Science",
      "Technology",
      "Reading",
      "Dancing",
      "Cooking",
      "Building",
      "Nature",
      "Traveling",
      "Games",
      "Puzzles",
      "Magic",
      "Dinosaurs",
      "Space",
      "Ocean",
      "Cars",
      "Trains",
      "Planes",
      "Bikes",
      "Princesses",
      "Knights",
      "Dragons",
      "Unicorns",
      "Robots",
      "Aliens",
    ],
  };
}
