import { forwardRef, memo, useMemo, useRef } from 'react';
import { clsx } from 'clsx';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Professional TextArea Component
 * Configurable resize behavior with validation support
 */
const TextAreaComponent = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    label,
    error,
    helpText,
    fullWidth = false,
    resize = 'vertical',
    className,
    id,
    rows = 4,
    ...props
  }, ref) => {
    const idCounter = useRef(0);
    const textareaId = useMemo(() => {
      if (id) return id;
      if (idCounter.current === 0) {
        idCounter.current = Date.now();
      }
      return `textarea-${idCounter.current}`;
    }, [id]);
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };
    
    const textareaClasses = clsx(
      'form-input min-h-[100px]',
      resizeClasses[resize],
      {
        'border-danger-300 focus:border-danger-500 focus:ring-danger-500': error,
        'w-full': fullWidth,
      },
      className
    );
    
    return (
      <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helpText ? `${textareaId}-help` : undefined
          }
          {...props}
        />
        
        {error && (
          <p id={`${textareaId}-error`} className="form-error">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${textareaId}-help`} className="text-sm text-secondary-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

TextAreaComponent.displayName = 'TextArea';

// Memoized version to prevent unnecessary re-renders
export const TextArea = memo(TextAreaComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent re-render when only reference changes
  return (
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.required === nextProps.required &&
    prevProps.rows === nextProps.rows &&
    prevProps.resize === nextProps.resize &&
    prevProps.id === nextProps.id &&
    prevProps.className === nextProps.className
  );
});