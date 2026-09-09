import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ startIcon, endIcon, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div
        className={`flex items-center gap-2 bg-surface-hover rounded-xl px-3 py-2 border border-border-default focus-within:border-border-focus focus-within:ring-1 focus-within:ring-primary/30 transition-all ${containerClassName}`}
      >
        {startIcon && <span className="shrink-0 text-text-muted flex items-center">{startIcon}</span>}
        <input
          ref={ref}
          className={`bg-transparent border-0 outline-none text-text-primary placeholder:text-text-muted font-sans text-xs md:text-body-compact w-full focus:ring-0 ${className}`}
          {...props}
        />
        {endIcon && <span className="shrink-0 flex items-center">{endIcon}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
