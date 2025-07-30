// Extended user type for our application
export interface ExtendedUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  plan?: 'free' | 'pro' | 'premium';
  storiesUsed?: number;
}

// Story type
export interface Story {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Character type for story customization
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}
