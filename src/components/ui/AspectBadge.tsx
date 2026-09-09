import React from 'react';

export interface AspectBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio: '16:9' | '9:16';
  className?: string;
}

export const AspectBadge: React.FC<AspectBadgeProps> = ({
  ratio,
  className = '',
  ...props
}) => {
  const isLandscape = ratio === '16:9';

  return (
    <div
      className={`border-2 border-current rounded flex items-center justify-center font-mono text-nano ${
        isLandscape ? 'w-10 h-6' : 'w-6 h-9'
      } ${className}`}
      {...props}
    >
      {ratio}
    </div>
  );
};
