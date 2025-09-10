import { forwardRef, memo, useMemo, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * Professional Select Component
 * Custom styling with native select functionality
 */
const SelectComponent = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label,
    error,
    helpText,
    fullWidth = false,
    options,
    placeholder,
    className,
    id,
    ...props
  }, ref) => {
    const idCounter = useRef(0);
    const selectId = useMemo(() => {
      if (id) return id;
      if (idCounter.current === 0) {
        idCounter.current = Date.now();
      }
      return `select-${idCounter.current}`;
    }, [id]);
    
    const selectClasses = clsx(
      'form-input appearance-none pr-10 cursor-pointer',
      {
        'border-danger-300 focus:border-danger-500 focus:ring-danger-500': error,
        'w-full': fullWidth,
      },
      className
    );
    
    return (
      <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-secondary-400" />
          </div>
        </div>
        
        {error && (
          <p id={`${selectId}-error`} className="form-error">
            {error}
          </p>
        )}
        
        {helpText && !error && (
          <p id={`${selectId}-help`} className="text-sm text-secondary-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

SelectComponent.displayName = 'Select';

// Memoized version to prevent unnecessary re-renders
export const Select = memo(SelectComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent re-render when only reference changes
  return (
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.error === nextProps.error &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.required === nextProps.required &&
    prevProps.id === nextProps.id &&
    prevProps.className === nextProps.className &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
});