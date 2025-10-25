import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
              aria-hidden
            >
              {leftIcon}
            </div>
          )}

          {/*
            Use inline style for padding to make sure icon spacing isn't accidentally
            overridden by consumer className (tw-merge can reorder classes). Inline
            style has higher specificity and prevents icon and input text overlap.
          */}
          <input
            type={type}
            id={inputId}
            className={cn(
              'input block w-full transition-colors duration-200',
              error && 'border-danger-300 focus:ring-danger-500 focus:border-danger-500',
              className
            )}
            style={{
              paddingLeft: leftIcon ? '2.5rem' : undefined,
              paddingRight: rightIcon ? '2.5rem' : undefined,
            }}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400" aria-hidden>
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
