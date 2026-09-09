import React from 'react';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min?: number;
  max?: number;
  onChangeValue: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  onChangeValue,
  className = '',
  ...props
}) => {
  return (
    <input
      type="range"
      aria-label={props['aria-label'] || 'Slider'}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChangeValue(Number(e.target.value))}
      className={`w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary ${className}`}
      {...props}
    />
  );
};
