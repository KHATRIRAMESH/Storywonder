'use client';

import { useApiData, useApiMutation } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, Users, BookOpen, Settings, AlertTriangle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalStories: number;
  activeUsers: number;
  todayStories: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: string;
  storiesUsed: number;
  createdAt: string;
  isAdmin: boolean;
}

export default function Admin() {
  const { user, isSignedIn } = useAuth();
  const { data: stats, loading: statsLoading, error: statsError } = useApiData<AdminStats>('/api/admin/stats');
  const { data: users, loading: usersLoading, error: usersError } = useApiData<User[]>('/api/admin/users');
  const { mutate, loading: actionLoading } = useApiMutation();

  // Check if user has admin privileges
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      await mutate(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
      });
      // Refresh the page or update the local state
      window.location.reload();
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage users, stories, and system settings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.totalUsers || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.totalStories || 0}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.activeUsers || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today&apos;s Stories</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : stats?.todayStories || 0}
              </p>
            </div>
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {(statsError || usersError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            {statsError || usersError || 'Unable to connect to the server. Please check if your backend server is running.'}
          </p>
        </div>
      )}

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        </div>

        <div className="p-6">
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Users will appear here once they sign up.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Stories Used</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                          user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {user.storiesUsed}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`View user: ${user.email}`)}
                            disabled={actionLoading}
                          >
                            View
                          </Button>
                          {!user.isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'promote')}
                              disabled={actionLoading}
                            >
                              Make Admin
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* System Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </Button>
          <Button
            variant="outline"
            onClick={() => handleUserAction('all', 'export')}
            disabled={actionLoading}
          >
            Export Users
          </Button>
        </div>
      </div>
    </div>
  );
}
