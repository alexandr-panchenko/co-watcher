import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'panel' | 'card' | 'hoverable' | 'overlay';
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'card',
  elevation = 'low',
  bordered = true,
  className = '',
  ...props
}) => {
  const variantStyles = {
    base: 'bg-surface-base',
    panel: 'bg-surface-panel',
    card: 'bg-surface-card',
    hoverable: 'bg-surface-panel hover:bg-surface-card transition-colors',
    overlay: 'bg-surface-overlay/95 backdrop-blur-md',
  }[variant];

  const elevationStyles = {
    flat: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-2xl',
  }[elevation];

  const borderStyles = bordered ? 'border border-border-default' : '';

  return (
    <div
      className={`rounded-xl ${variantStyles} ${elevationStyles} ${borderStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
