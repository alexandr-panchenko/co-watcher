import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-primary/50',
  secondary:
    'bg-surface-card hover:bg-surface-hover text-text-primary border border-border-default hover:border-border-hover shadow-sm',
  ghost:
    'bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-sm',
  amber:
    'bg-amber-500 hover:bg-amber-400 text-surface-base font-semibold shadow-sm',
};

const SIZE_STYLES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  md: 'text-xs md:text-body-compact px-3.5 py-1.5 rounded-lg gap-2',
  lg: 'text-sm px-4 py-2.5 rounded-xl gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const variantClass = VARIANT_STYLES[variant];
  const sizeClass = SIZE_STYLES[size];

  const renderIcon = (pos: 'left' | 'right') => {
    if (isLoading && pos === 'left') {
      return <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>;
    }
    if (!isLoading && icon && iconPosition === pos) {
      return <span className="shrink-0 flex items-center">{icon}</span>;
    }
    return null;
  };

  return (
    <button
      type={props.type || 'button'}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-sans transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed outline-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {renderIcon('left')}
      {children}
      {renderIcon('right')}
    </button>
  );
};
