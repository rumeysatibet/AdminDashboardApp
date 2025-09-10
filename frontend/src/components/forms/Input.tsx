import { forwardRef, memo, useMemo, useRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

/**
 * Professional Input Component
 * Full form integration with validation states and accessibility
 */
const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    helpText,
    fullWidth = false,
    className,
    id,
    ...props
  }, ref) => {
    const idCounter = useRef(0);
    const inputId = useMemo(() => {
      if (id) return id;
      if (idCounter.current === 0) {
        idCounter.current = Date.now();
      }
      return `input-${idCounter.current}`;
    }, [id]);
    
    const inputClasses = useMemo(() => clsx(
      'form-input',
      {
        'border-danger-300 focus:border-danger-500 focus:ring-danger-500': error,
        'w-full': fullWidth,
      },
      className
    ), [error, fullWidth, className]);
    
    return (
      <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        {error && (
          <p id={`${inputId}-error`} className="form-error">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-secondary-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

InputComponent.displayName = 'Input';

// Memoized version to prevent unnecessary re-renders
export const Input = memo(InputComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent re-render when only reference changes
  return (
    prevProps.value === nextProps.value &&
    prevProps.name === nextProps.name &&
    prevProps.label === nextProps.label &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.type === nextProps.type &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.required === nextProps.required &&
    prevProps.autoFocus === nextProps.autoFocus &&
    prevProps.id === nextProps.id &&
    prevProps.className === nextProps.className
  );
});