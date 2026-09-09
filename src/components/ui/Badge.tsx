import React from 'react';
import { GemVariant } from '../../styles/tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GemVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<GemVariant, string> = {
    sapphire: 'bg-primary-container/20 text-primary border-primary/30',
    emerald: 'bg-secondary-container/20 text-secondary border-secondary/30',
    amber: 'bg-amber-container/20 text-amber border-amber-container/40',
    rose: 'bg-tertiary-container/20 text-tertiary border-tertiary/30',
    purple: 'bg-purple-container/20 text-purple border-purple/30',
    neutral: 'bg-surface-hover text-text-secondary border-white/5',
  };

  const sizeStyles = {
    sm: 'text-nano px-1.5 py-0.5',
    md: 'text-caption-sm px-2 py-0.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-full border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles} ${className}`}
      {...props}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            variant === 'emerald'
              ? 'bg-secondary'
              : variant === 'amber'
              ? 'bg-amber'
              : variant === 'rose'
              ? 'bg-tertiary'
              : variant === 'purple'
              ? 'bg-purple'
              : 'bg-primary'
          }`}
        />
      )}
      {children}
    </span>
  );
};
