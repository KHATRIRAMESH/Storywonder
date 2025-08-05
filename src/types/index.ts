// Extended user type for our application
export interface ExtendedUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  plan?: "free" | "pro" | "premium";
  storiesUsed?: number;
}

// Story type
export interface Story {
  id: string;
  userId: string;
  title: string;
  content?: string;
  status: "pending" | "generating" | "completed" | "failed";
  isPublic: boolean;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  childName?: string;
  childAge?: number;
  theme?: string;
  interests?: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  subscriptionLevel?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthVerification {
  authenticated: boolean;
  user?: User;
}

export interface StoryCreationData {
  title?: string;
  childName: string;
  childAge: number;
  childGender: "boy" | "girl" | "other";
  interests: string[];
  theme: string;
  storyLength: "short" | "medium" | "long";
  isPublic?: boolean;
  image?: File;
}

// export interface CreateStoryRequest extends StoryCreationData {}

export interface StoryPage {
  id: string;
  storyId: string;
  pageNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserStats {
  totalStories: number;
  publishedStories: number;
  completedStories: number;
  generatingStories: number;
  failedStories: number;
}

export interface UserSubscription {
  level: "free" | "premium";
  storiesRemaining?: number;
  resetDate?: string;
  isPremium: boolean;
}

// Character type for story customization
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}
