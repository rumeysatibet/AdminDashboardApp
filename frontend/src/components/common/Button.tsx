import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from '../../types';

/**
 * Professional Button Component
 * Supports multiple variants, sizes, loading state, and full accessibility
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children,
    variant = 'primary',
    size = 'medium',
    loading = false,
    fullWidth = false,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'btn';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      danger: 'btn-danger',
      outline: 'btn-outline',
    };
    
    const sizeClasses = {
      small: 'btn-sm',
      medium: 'btn-md',
      large: 'btn-lg',
    };
    
    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      {
        'w-full': fullWidth,
        'cursor-not-allowed opacity-50': disabled || loading,
      },
      className
    );
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="spinner w-4 h-4 mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';