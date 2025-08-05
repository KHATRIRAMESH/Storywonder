import {
  AuthResponse,
  Story,
  StoryCreationData,
  StoryPage,
  User,
  UserProfile,
  UserStats,
  UserSubscription,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Authentication management
class AuthManager {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token") || this.getCookieToken();
    }
  }

  private getCookieToken(): string | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token") {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      // Clear cookie
      document.cookie =
        "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

const authManager = new AuthManager();

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = authManager.getToken();

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle authentication errors
      if (response.status === 401) {
        authManager.clearToken();
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role: "user",
      }),
    });

    authManager.setToken(response.token);
    return response;
  }

  async verifyEmail(email: string, verificationCode: string): Promise<void> {
    await this.request("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, verificationCode }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log("Login response:", response);

    authManager.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", {
      method: "POST",
    });

    authManager.clearToken();
  }

  async verifyAuth(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      return await this.request<{ authenticated: boolean; user: User }>(
        "/api/auth/verify"
      );
    } catch {
      authManager.clearToken();
      return { authenticated: false };
    }
  }

  // OAuth methods
  getGoogleAuthUrl(): string {
    return `${this.baseUrl}/api/auth/google`;
  }

  getAppleAuthUrl(): string {
    return `${this.baseUrl}/api/auth/apple`;
  }

  // User profile methods
  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>("/api/auth/profile");
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>("/api/auth/stats");
  }

  async getUserSubscription(): Promise<UserSubscription> {
    return this.request<UserSubscription>("/api/auth/subscription");
  }

  // Story methods
  async getStories(): Promise<Story[]> {
    return this.request<Story[]>("/api/stories");
  }

  async getStory(id: string): Promise<Story> {
    return this.request<Story>(`/api/stories/${id}`);
  }

  async getStoryById(id: string): Promise<Story> {
    return this.getStory(id);
  }

  async getStoryPages(id: string): Promise<StoryPage[]> {
    return this.request<StoryPage[]>(`/api/stories/${id}/pages`);
  }

  async downloadStory(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/stories/${id}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authManager.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download story: ${response.statusText}`);
    }

    return response.blob();
  }

  async getStoryPDF(id: string): Promise<string> {
    const response = await this.request<{ pdfUrl: string }>(
      `/api/stories/${id}/pdf`
    );
    return response.pdfUrl;
  }

  async createStory(data: StoryCreationData): Promise<Story> {
    if (data.image) {
      // Handle file upload
      const formData = new FormData();
      formData.append("image", data.image);

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/api/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authManager.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create story");
      }

      return await response.json();
    } else {
      return this.request<Story>("/api/stories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  }

  async updateStory(
    id: string,
    data: Partial<StoryCreationData>
  ): Promise<Story> {
    if (data.image) {
      // Handle file upload
      const formData = new FormData();
      formData.append("image", data.image);

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${this.baseUrl}/api/stories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authManager.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update story");
      }

      return await response.json();
    } else {
      return this.request<Story>(`/api/stories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
  }

  async deleteStory(id: string): Promise<void> {
    await this.request(`/api/stories/${id}`, {
      method: "DELETE",
    });
  }

  // Authentication state
  isAuthenticated(): boolean {
    return authManager.isAuthenticated();
  }

  getAuthToken(): string | null {
    return authManager.getToken();
  }
}

// Export singleton instance
export const apiService = new ApiClient();
export { authManager };
