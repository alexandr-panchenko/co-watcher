import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenType } from '../../../types';
import { Button } from '../../ui';

interface Suggestion {
  text: string;
  target: ScreenType;
}

interface PromptSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (item: Suggestion) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => {
  const { t } = useTranslation('home');

  return (
    <div className="w-full max-w-3xl flex flex-col items-center mb-8">
      <span className="font-mono text-caption-sm uppercase tracking-wider text-text-muted mb-3 select-none font-semibold">
        {t('suggestions.label')}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestions.map((item, idx) => (
          <Button
            key={idx}
            variant="secondary"
            size="sm"
            onClick={() => onSelect(item)}
            className="rounded-full text-xs text-text-secondary hover:text-text-primary text-left"
          >
            {item.text}
          </Button>
        ))}
      </div>
    </div>
  );
};
