import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import type { ToastProps, ToastType } from '../../types';

/**
 * Professional Toast Notification Component
 * Auto-dismiss, multiple types, and smooth animations
 */
export function Toast({ 
  type, 
  message, 
  duration = 5000, 
  onClose 
}: ToastProps) {
  // Auto dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const typeConfig: Record<ToastType, {
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }> = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      textColor: 'text-success-800',
      borderColor: 'border-success-200',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-danger-50',
      textColor: 'text-danger-800',
      borderColor: 'border-danger-200',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-800',
      borderColor: 'border-warning-200',
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-800',
      borderColor: 'border-primary-200',
    },
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  const toastClasses = clsx(
    'flex items-center p-4 mb-4 rounded-lg border shadow-soft transition-all duration-300',
    config.bgColor,
    config.textColor,
    config.borderColor
  );
  
  return (
    <div className={toastClasses}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button
        onClick={onClose}
        className={clsx(
          'ml-3 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors',
          config.textColor
        )}
        aria-label="Bildirimi kapat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast Container - Position toasts at top-right
 */
interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {children}
    </div>
  );
}

