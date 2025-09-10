import { Home, Users, FileText, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { Button } from './Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  totalUsers?: number;
  totalPosts?: number;
}

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
  },
  {
    path: '/posts',
    label: 'Posts',
    icon: FileText,
  },
];

/**
 * Professional Sidebar Navigation Component
 * Responsive design with mobile overlay and desktop fixed position
 */
export function Sidebar({ isOpen, onClose, totalUsers = 0, totalPosts = 0 }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={clsx(
          'sidebar w-64',
          // Mobile: Transform based on isOpen state
          'lg:translate-x-0', // Always visible on desktop
          isOpen ? 'translate-x-0' : '-translate-x-full' // Mobile slide animation
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UM</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-secondary-900">
                User Management
              </h2>
              <p className="text-xs text-secondary-600">Dashboard</p>
            </div>
          </div>
          
          {/* Close button - only visible on mobile */}
          <Button
            variant="secondary"
            size="small"
            onClick={onClose}
            className="lg:hidden !p-1"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={clsx(
                      'sidebar-item w-full rounded-lg',
                      {
                        'active': isActive,
                      }
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Divider */}
          <div className="my-6 border-t border-secondary-200"></div>
          
          {/* Additional Section */}
          <div className="px-3">
            <h3 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-3">
              Statistics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-600">Total Users</span>
                <span className="font-semibold text-secondary-900">{totalUsers}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary-600">Total Posts</span>
                <span className="font-semibold text-secondary-900">{totalPosts}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}