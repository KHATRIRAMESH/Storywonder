# Backend Integration Guide

## Overview

This Storybook frontend application has been successfully integrated with your backend API running on port 8000. The integration includes authentication, user profiles, subscription management, and story limits.

## What's Been Implemented

### 🔐 Authentication Integration
- **Clerk Authentication**: Frontend handles user sign-in/sign-up
- **Backend Verification**: User tokens are verified with your backend
- **JWT Token Flow**: Clerk tokens are sent as Bearer tokens to backend APIs

### 📊 User Profile & Subscription
- **Profile Data**: Loads user information from backend
- **Subscription Status**: Displays current plan (Free, Pro, Premium)
- **Story Limits**: Enforces monthly story generation limits
- **Usage Tracking**: Shows stories used vs. available

### 🎨 UI Features
- **Connection Status**: Visual indicators for backend connectivity
- **Error Handling**: Graceful fallbacks when backend is unavailable
- **Loading States**: Smooth loading experiences during API calls
- **Subscription Cards**: Beautiful plan visualization with icons

### 🔄 API Endpoints Used
- `GET /api/auth/verify` - Verify user authentication
- `GET /api/auth/profile` - Get user profile data
- `GET /api/auth/subscription` - Get subscription details
- `GET /api/auth/stats` - Get user statistics

## Files Modified

### Core Integration Files
- `src/hooks/useAuthenticatedFetch.ts` - Backend API integration hooks
- `src/lib/api.ts` - Core API utility functions
- `.env.local` - Environment configuration

### Updated Components
- `src/app/dashboard/page.tsx` - Dashboard with backend data
- `src/app/create-story/page.tsx` - Story creation with limits
- `src/components/Header.tsx` - Already Clerk-integrated
- `src/components/Footer.tsx` - Already optimized

### Configuration
- `middleware.ts` - Route protection
- `.env.example` - Environment template

## Environment Configuration

Your `.env.local` should contain:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing the Integration

### 1. Run the Test Script
```bash
./test-backend-integration.sh
```

### 2. Manual Testing Steps
1. **Start Backend**: Ensure your server runs on port 8000
2. **Start Frontend**: `npm run dev`
3. **Sign In**: Use Clerk authentication
4. **Check Dashboard**: Should show backend data or connection errors
5. **Try Creating Stories**: Should respect subscription limits

### 3. Expected Behavior

#### When Backend is Running ✅
- Dashboard shows user profile from backend
- Subscription status and limits display correctly
- Story creation respects monthly limits
- Green "Connected" status indicators

#### When Backend is Down ❌
- Clear error messages about backend connection
- Fallback to local Clerk data where possible
- Retry buttons for failed connections
- Yellow warning indicators

## API Hook Usage

### Authentication Verification
```typescript
const { authStatus, loading, error } = useAuthVerification();
```

### User Profile
```typescript
const { profile, loading, error } = useBackendProfile();
```

### User Statistics
```typescript
const { stats, loading, error } = useUserStats();
```

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: When backend is unreachable
2. **Authentication Errors**: When tokens are invalid
3. **API Errors**: When backend returns error responses
4. **Graceful Degradation**: App continues working with limited functionality

## Backend API Expected Format

### Profile Response (`/api/auth/profile`)
```json
{
  "id": "user_123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "subscriptionLevel": "free|pro|premium",
  "storiesGenerated": 5,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Stats Response (`/api/auth/stats`)
```json
{
  "storiesGenerated": 5,
  "subscriptionLevel": "free",
  "subscriptionFeatures": {
    "storiesPerMonth": 10,
    "maxPages": 5,
    "customCharacters": false,
    "pdfDownload": false,
    "support": "community"
  },
  "hasReachedStoryLimit": false,
  "memberSince": "2024-01-01T00:00:00Z"
}
```

## Troubleshooting

### Common Issues

1. **"Backend Connection Error"**
   - Check if backend server is running on port 8000
   - Verify CORS settings allow localhost:3000
   - Check network connectivity

2. **"Authentication Failed"**
   - Verify Clerk webhook setup in backend
   - Check JWT token validation in backend
   - Ensure Bearer token format is correct

3. **"Story Limits Not Working"**
   - Check `/api/auth/stats` endpoint response format
   - Verify `hasReachedStoryLimit` boolean field
   - Check subscription feature calculation logic

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

This will show API call details in browser console.

## Next Steps

1. **Connect Backend**: Start your backend server on port 8000
2. **Test Integration**: Run the test script and check all endpoints
3. **Customize UI**: Adjust subscription plans and pricing in components
4. **Add Features**: Extend with additional backend endpoints as needed

## Support

The integration is designed to be robust and handle various scenarios. The UI will clearly indicate connection status and provide helpful error messages to guide troubleshooting.
