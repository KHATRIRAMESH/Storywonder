// API configuration for external server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    stories: '/api/stories',
    users: '/api/users',
    admin: '/api/admin',
  },
};

// Helper function to make API calls with authentication
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
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
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Helper to get Clerk token for API calls
export async function getAuthToken() {
  // This will be used in client components with useAuth() hook
  // or in server components with auth() from Clerk
  return null; // Placeholder - implement based on your needs
}
