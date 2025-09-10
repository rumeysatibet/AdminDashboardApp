import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserService } from '../../services/userService';
import { PostService } from '../../services/postService';
import { useDataRefresh } from '../../hooks/useDataRefresh';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

/**
 * Master Layout Component
 * Manages sidebar state, responsive behavior, and global toast notifications
 */
export function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  
  const { refreshTrigger } = useDataRefresh();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Load sidebar statistics
  const loadSidebarStats = useCallback(async () => {
    try {
      const [users, posts] = await Promise.all([
        UserService.getAllUsers(),
        PostService.getAllPosts(),
      ]);
      
      setTotalUsers(users.length);
      setTotalPosts(posts.length);
    } catch (error) {
      console.error('Layout: Failed to load sidebar statistics:', error);
      // Keep default values on error
    }
  }, []);

  useEffect(() => {
    loadSidebarStats();
  }, [loadSidebarStats, refreshTrigger]);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        totalUsers={totalUsers}
        totalPosts={totalPosts}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header onMenuToggle={toggleSidebar} title={title} />

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}