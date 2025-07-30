// API configuration for external server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: {
      verify: "/api/auth/verify",
      profile: "/api/auth/profile",
      subscription: "/api/auth/subscription",
      stats: "/api/auth/stats",
    },
    stories: "/api/stories",
    users: "/api/users",
    admin: "/api/admin",
  },
};

// Helper function to make API calls with authentication
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`[API Call] ${options.method || "GET"} ${url}`);

  const defaultHeaders: HeadersInit = {
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
    // Create a promise that rejects after 10 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 10000);
    });

    const response = await Promise.race([fetch(url, config), timeoutPromise]);

    console.log(`[API Response] ${url} - Status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.message ||
          `API call failed: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error(`[API Error] ${url}:`, error);

    if (error instanceof Error) {
      if (error.message === "Request timeout") {
        throw new Error("Request timeout - please check your backend server");
      }
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Unable to connect to backend server. Please ensure it is running on port 8000."
        );
      }
    }

    throw error;
  }
}

// Helper to get Clerk token for API calls
export async function getAuthToken() {
  // This will be used in client components with useAuth() hook
  // or in server components with auth() from Clerk
  return null; // Placeholder - implement based on your needs
}
