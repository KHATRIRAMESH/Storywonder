'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface AdminStats {
  totalUsers: number;
  totalStories: number;
  activeUsers: number;
  todayStories: number;
}

interface AdminData {
  stats: AdminStats;
  users: unknown[];
  recentStories: unknown[];
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  const checkAdminAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, simple admin check - you can enhance this with backend validation
      const isAdmin = user?.email === 'admin@example.com' || user?.email?.includes('admin');
      
      if (!isAdmin) {
        setError('Access denied. Admin privileges required.');
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
      
      // Mock admin data - replace with actual API call
      setAdminData({
        stats: {
          totalUsers: 150,
          totalStories: 1250,
          activeUsers: 45,
          todayStories: 12
        },
        users: [],
        recentStories: []
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify admin access');
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (isAuthenticated) {
      checkAdminAccess();
    }
  }, [isAuthenticated, router, checkAdminAccess]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            {error || 'You do not have permission to access the admin panel.'}
          </p>
          <Button onClick={() => router.push('/dashboard-new')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users and monitor system activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">👥</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.stats.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📚</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.stats.totalStories || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">📖</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stories Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.stats.todayStories || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl">⚡</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminData?.stats.activeUsers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-gray-500">View and edit user accounts</div>
              </div>
            </Button>
            
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-gray-500">View detailed statistics</div>
              </div>
            </Button>
            
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-medium">Settings</div>
                <div className="text-sm text-gray-500">Configure system settings</div>
              </div>
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Backend Server</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Database Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">AI Service</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
