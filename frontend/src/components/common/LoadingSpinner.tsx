import { clsx } from 'clsx';
import type { LoadingSpinnerProps } from '../../types';

/**
 * Professional Loading Spinner Component
 * Various sizes and colors for different use cases
 */
export function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    secondary: 'border-secondary-200 border-t-secondary-500',
  };
  
  const spinnerClasses = clsx(
    'spinner',
    sizeClasses[size],
    colorClasses[color]
  );
  
  if (text) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className={spinnerClasses} />
        <p className="mt-4 text-sm text-secondary-600">{text}</p>
      </div>
    );
  }
  
  return <div className={spinnerClasses} />;
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
}

/**
 * Inline loading for smaller components
 */
export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="small" />
      {text && <span className="ml-2 text-sm text-secondary-600">{text}</span>}
    </div>
  );
}