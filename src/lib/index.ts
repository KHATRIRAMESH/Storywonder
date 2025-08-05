import { StoryCreationData } from "@/types";

// Core API Service
export { apiService as default, apiService } from "./apiService";

// API Types
export type {
  // ApiResponse,
  User,
  AuthVerification,
  UserSubscription,
  UserStats,
  Story,
  StoryCreationData,
  StoryPage,
} from "@/types";

// Authentication Hooks
export {
  useAuthApi,
  useUserProfile,
  useUserSubscription,
  useUserStats,
} from "../hooks/useApiAuthNew";

// Story Management Hooks
export {
  useStories,
  useStory,
  useStoryCreation,
  useStoryStatusPolling,
  useStoryOptions,
} from "../hooks/useStoryApiNew";

// Enhanced useAuth hook that works with both Clerk and backend auth
export { useAuth } from "../hooks/useAuth";

// Legacy API functions for backward compatibility
export { apiCall } from "./api";

// Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  endpoints: {
    auth: {
      verify: "/api/auth/verify",
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      profile: "/api/auth/profile",
      subscription: "/api/auth/subscription",
      stats: "/api/auth/stats",
    },
    stories: {
      list: "/api/stories",
      create: "/api/stories",
      byId: (id: number) => `/api/stories/${id}`,
      pages: (id: number) => `/api/stories/${id}/pages`,
      download: (id: number) => `/api/stories/${id}/download`,
      pdf: (id: number) => `/api/stories/${id}/pdf`,
    },
    health: "/health",
  },
};

// Utility functions
export const ApiUtils = {
  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  // Get stored auth token
  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("backendToken");
  },

  // Store auth token
  storeToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("backendToken", token);
  },

  // Clear stored auth data
  clearStoredAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("backendToken");
    localStorage.removeItem("backendUser");
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Validate story creation data
  validateStoryData(data: Partial<StoryCreationData>): string[] {
    const errors: string[] = [];

    if (!data.childName || data.childName.trim().length < 2) {
      errors.push("Child name must be at least 2 characters");
    }

    if (!data.childAge || data.childAge < 3 || data.childAge > 12) {
      errors.push("Child age must be between 3 and 12");
    }

    if (!data.childGender) {
      errors.push("Child gender is required");
    }

    if (!data.theme) {
      errors.push("Story theme is required");
    }

    if (!data.storyLength) {
      errors.push("Story length is required");
    }

    if (data.image && data.image.size > 5 * 1024 * 1024) {
      errors.push("Image file must be smaller than 5MB");
    }

    return errors;
  },

  // Get story status color
  getStoryStatusColor(status: string): string {
    switch (status) {
      case "generating":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  },

  // Get story status label
  getStoryStatusLabel(status: string): string {
    switch (status) {
      case "generating":
        return "Generating...";
      case "completed":
        return "Ready";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  },
};
