import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { Button, Modal } from '../components/common';
import { QuickUserForm } from '../components/forms';
import { UserService } from '../services/userService';
import { PostService } from '../services/postService';
import { useToastContext } from '../hooks/useToastContext';
import { useDataRefresh } from '../hooks/useDataRefresh';
import type { User, Post, CreateUserRequest } from '../types';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  averagePostsPerUser: number;
  loading: boolean;
}

/**
 * Professional Dashboard Home Page
 * Overview statistics and quick actions
 */
export function HomePage() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const { refreshTrigger } = useDataRefresh();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    averagePostsPerUser: 0,
    loading: true,
  });

  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  // Quick Add User Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Load users and posts in parallel
      const [users, posts] = await Promise.all([
        UserService.getAllUsers(),
        PostService.getAllPosts(),
      ]);

      // Calculate statistics
      const totalUsers = users.length;
      const totalPosts = posts.length;
      const averagePostsPerUser = totalUsers > 0 ? Math.round(totalPosts / totalUsers) : 0;

      setStats({
        totalUsers,
        totalPosts,
        averagePostsPerUser,
        loading: false,
      });

      // Set recent data (first 5 items)
      setRecentUsers(users.slice(0, 5));
      setRecentPosts(posts.slice(0, 5));

    } catch (error) {
      console.error('Dashboard data loading error:', error);
      toast.error('Error loading dashboard data');
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, refreshTrigger]);

  // Refresh data when page comes back into focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadDashboardData]);

  // Handle quick add user
  const handleQuickAddUser = useCallback(async (userData: CreateUserRequest) => {
    try {
      setIsSubmitting(true);
      const newUser = await UserService.createUser(userData);
      
      console.log('New user created:', newUser);
      
      toast.success(`User "${newUser.name}" added successfully!`);
      setIsQuickAddOpen(false);
      
      // Reload dashboard data to get updated statistics
      await loadDashboardData();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, loadDashboardData]);

  // Handle report generation (placeholder)
  const handleGenerateReport = () => {
    const reportData = {
      totalUsers: stats.totalUsers,
      totalPosts: stats.totalPosts,
      averagePostsPerUser: stats.averagePostsPerUser,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully!');
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary',
    loading = false 
  }: {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'primary' | 'success' | 'warning' | 'secondary';
    loading?: boolean;
  }) => {
    const colorClasses = {
      primary: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      secondary: 'bg-secondary-500',
    };

    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-secondary-600">{title}</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading ? (
                  <div className="animate-pulse bg-secondary-200 h-8 w-16 rounded"></div>
                ) : (
                  value
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Welcome to Dashboard!
              </h1>
              <p className="text-secondary-600 mt-1">
                Manage your users and posts data
              </p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button 
                variant="primary"
                onClick={() => setIsQuickAddOpen(true)}
              >
                Add New User
              </Button>
              <Button 
                variant="outline"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="primary"
          loading={stats.loading}
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="success"
          loading={stats.loading}
        />
        <StatCard
          title="Average Posts"
          value={`${stats.averagePostsPerUser}/user`}
          icon={TrendingUp}
          color="warning"
          loading={stats.loading}
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={Activity}
          color="secondary"
          loading={stats.loading}
        />
      </div>

      {/* Recent Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Recent Users
              </h3>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => navigate('/users')}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {stats.loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="animate-pulse bg-secondary-200 h-10 w-10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="animate-pulse bg-secondary-200 h-4 w-32 rounded mb-1"></div>
                      <div className="animate-pulse bg-secondary-200 h-3 w-48 rounded"></div>
                    </div>
                  </div>
                ))
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">
                  No users found yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Recent Posts
              </h3>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => navigate('/posts')}
              >
                View All
              </Button>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {stats.loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="animate-pulse bg-secondary-200 h-4 w-full rounded"></div>
                    <div className="animate-pulse bg-secondary-200 h-3 w-24 rounded"></div>
                  </div>
                ))
              ) : recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post.id} className="border-b border-secondary-100 pb-3 last:border-b-0">
                    <h4 className="text-sm font-medium text-secondary-900 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-secondary-500 mt-1">
                      User ID: {post.userId}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">
                  No posts found yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add User Modal */}
      <Modal
        key="quick-add-user-modal"
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Add New User"
      >
        <QuickUserForm
          onSubmit={handleQuickAddUser}
          onCancel={() => setIsQuickAddOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}