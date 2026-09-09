import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div
        className={`flex bg-surface-hover rounded-xl px-3 py-2 border border-border-default focus-within:border-border-focus focus-within:ring-1 focus-within:ring-primary/30 transition-all ${containerClassName}`}
      >
        <textarea
          ref={ref}
          className={`bg-transparent border-0 outline-none text-text-primary placeholder:text-text-muted font-sans text-xs md:text-body-compact w-full focus:ring-0 resize-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
