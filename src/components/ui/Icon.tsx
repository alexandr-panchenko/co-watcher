import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', ...props }) => {
  return (
    <span className={`material-symbols-outlined ${className}`} {...props}>
      {name}
    </span>
  );
};
