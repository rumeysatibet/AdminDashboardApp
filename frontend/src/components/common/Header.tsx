import { Menu, Search, Bell, User } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

/**
 * Professional Header Component
 * Responsive design with mobile hamburger menu and desktop features
 */
export function Header({ onMenuToggle, title }: HeaderProps) {
  return (
    <header className="header sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="secondary"
            size="small"
            onClick={onMenuToggle}
            className="lg:hidden !p-2"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Title */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-secondary-900">
              {title}
            </h1>
            <p className="text-sm text-secondary-600 hidden sm:block">
              User and Post Management
            </p>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search Button - Hidden on small screens */}
          <Button
            variant="secondary"
            size="small"
            className="hidden md:flex !p-2"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="secondary"
              size="small"
              className="!p-2 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full text-xs"></span>
            </Button>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="small"
              className="!p-2"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </Button>
            
            {/* User Info - Hidden on mobile */}
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-secondary-900">
                Admin User
              </p>
              <p className="text-xs text-secondary-600">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}