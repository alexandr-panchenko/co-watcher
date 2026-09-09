import React from 'react';
import { Icon } from './Icon';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary' | 'filled';
  iconSize?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  size = 'md',
  variant = 'ghost',
  iconSize,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  const defaultIconSizes = {
    sm: 16,
    md: 18,
    lg: 22,
  }[size];

  const variantStyles = {
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
    secondary: 'bg-surface-card hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-default',
    filled: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
  }[variant];

  return (
    <button
      type={props.type || 'button'}
      aria-label={props['aria-label'] || props.title || iconName}
      className={`inline-flex items-center justify-center rounded-lg transition-colors cursor-pointer select-none outline-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      <Icon
        name={iconName}
        style={{ fontSize: `${iconSize || defaultIconSizes}px` }}
      />
    </button>
  );
};
