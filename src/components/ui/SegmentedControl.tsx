
export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs',
  }[size];

  const itemSizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
  }[size];

  return (
    <div
      className={`inline-flex items-center bg-surface-hover rounded-full border border-white/5 shadow-inner ${sizeStyles} ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer select-none ${itemSizeStyles} ${
              isSelected
                ? 'bg-surface-card text-text-primary shadow-sm font-semibold'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {option.icon && (
              <span className="material-symbols-outlined text-sm leading-none">{option.icon}</span>
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
