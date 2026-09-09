
export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: string | undefined;
  badge?: string | number | undefined;
  disabled?: boolean | undefined;
  title?: string | undefined;
}

export interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pill',
}: TabsProps<T>) {
  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-4 border-b border-white/5 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = Boolean(tab.disabled);
          return (
            <button
              key={tab.id}
              type="button"
              disabled={isDisabled}
              title={tab.title}
              onClick={() => {
                if (!isDisabled) onChange(tab.id);
              }}
              className={`pb-2 text-xs md:text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed text-text-muted'
                  : isActive
                  ? 'text-text-primary font-semibold cursor-pointer'
                  : 'text-text-muted hover:text-text-secondary cursor-pointer'
              }`}
            >
              {tab.icon && <span className="material-symbols-outlined text-base">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-micro px-1.5 py-0.5 rounded-full bg-surface-hover text-text-secondary font-mono">
                  {tab.badge}
                </span>
              )}
              {isActive && !isDisabled && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-tab-active" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 bg-surface-panel p-1 rounded-lg border border-white/5 text-xs ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const isDisabled = Boolean(tab.disabled);
        return (
          <button
            key={tab.id}
            type="button"
            disabled={isDisabled}
            title={tab.title}
            onClick={() => {
              if (!isDisabled) onChange(tab.id);
            }}
            className={`px-3 py-1 rounded transition-all font-medium flex items-center gap-1.5 select-none ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed text-text-muted'
                : isActive
                ? 'bg-surface-hover text-text-primary shadow-sm cursor-pointer'
                : 'text-text-muted hover:text-text-secondary cursor-pointer'
            }`}
          >
            {tab.icon && <span className="material-symbols-outlined text-sm">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-nano px-1 py-0.5 rounded bg-secondary/20 text-secondary font-mono font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
