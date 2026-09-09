import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Input } from '../../ui';

interface CutAssistantChatProps {
  history: Array<{ sender: 'user' | 'ai'; text: string; details?: string }>;
  refinePrompt: string;
  onChangeRefinePrompt: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onApplyQuickRevision: (type: string) => void;
}

export const CutAssistantChat: React.FC<CutAssistantChatProps> = ({
  history,
  refinePrompt,
  onChangeRefinePrompt,
  onSubmit,
  onApplyQuickRevision,
}) => {
  const { t } = useTranslation('assembly');

  return (
    <div className="p-4 flex flex-col justify-between h-full gap-4 bg-surface-panel rounded-xl border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-container/20 text-amber flex items-center justify-center font-bold text-xs">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </div>
          <span className="font-sans text-sm font-semibold text-text-primary">
            {t('assistant.title')}
          </span>
        </div>
        <span className="text-micro font-mono text-secondary bg-secondary-container/20 px-2 py-0.5 rounded font-bold uppercase">
          {t('assistant.agentActive')}
        </span>
      </div>

      {/* Interactive Quick Revisions Pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-caption-sm font-mono text-text-muted uppercase tracking-wider">
          {t('assistant.quickEdits')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onApplyQuickRevision('trim-3s')}
            className="text-caption-sm font-mono text-text-secondary hover:text-text-primary"
            icon={<span className="material-symbols-outlined text-xs text-amber">content_cut</span>}
          >
            {t('assistant.trim3s')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onApplyQuickRevision('mute-source')}
            className="text-caption-sm font-mono text-text-secondary hover:text-text-primary"
            icon={<span className="material-symbols-outlined text-xs text-secondary">volume_off</span>}
          >
            {t('assistant.muteSource')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onApplyQuickRevision('diagram-fullscreen')}
            className="text-caption-sm font-mono text-text-secondary hover:text-text-primary"
            icon={<span className="material-symbols-outlined text-xs text-purple">splitscreen</span>}
          >
            {t('assistant.fullscreenSchematic')}
          </Button>
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-56">
        {history.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-nano font-bold shrink-0 mt-0.5 ${
                  item.sender === 'user'
                    ? 'bg-amber text-surface-card'
                    : 'bg-primary text-on-primary'
                }`}
              >
                {item.sender === 'user' ? 'ME' : 'AI'}
              </div>
              <div
                className={`p-2.5 rounded-xl text-xs font-sans leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-surface-card text-text-primary rounded-tl-none border border-white/5 max-w-sm'
                    : 'bg-surface-canvas text-text-secondary rounded-tl-none border border-primary/30 max-w-md'
                }`}
              >
                {item.text}
                {item.details && (
                  <div className="mt-1 pt-1 border-t border-white/5 font-mono text-micro text-secondary">
                    ✓ {item.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom conversational prompt input */}
      <form onSubmit={onSubmit} className="flex flex-col gap-1.5 pt-2 border-t border-border-default">
        <Input
          value={refinePrompt}
          onChange={(e) => onChangeRefinePrompt(e.target.value)}
          placeholder={t('assistant.placeholder')}
          startIcon={<span className="material-symbols-outlined text-base">movie_filter</span>}
          endIcon={
            <div className="flex items-center gap-1">
              <IconButton
                iconName="mic"
                type="button"
                size="sm"
                onClick={() =>
                  onChangeRefinePrompt(
                    'Bring in the projection diagram full screen right as I say non-obvious.'
                  )
                }
                title={t('assistant.voiceTitle')}
              />
              <IconButton
                iconName="arrow_upward"
                type="submit"
                variant="filled"
                size="sm"
                title={t('assistant.executeTitle')}
                className="w-7 h-7 rounded-full bg-amber hover:bg-amber-container text-black font-bold"
              />
            </div>
          }
        />
        <div className="flex items-center justify-between text-caption-sm font-mono text-text-muted px-1">
          <span>{t('assistant.footerHint')}</span>
          <span>{t('assistant.footerEnter')}</span>
        </div>
      </form>
    </div>
  );
};
