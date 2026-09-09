import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, IconButton } from '../../ui';

interface HomeChatBarProps {
  inputText: string;
  onChangeInput: (text: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onAttachClick: () => void;
}

export const HomeChatBar: React.FC<HomeChatBarProps> = ({
  inputText,
  onChangeInput,
  onSubmit,
  onAttachClick,
}) => {
  const { t } = useTranslation('home');

  return (
    <form onSubmit={onSubmit} className="w-full max-w-3xl flex flex-col gap-2">
      <Input
        value={inputText}
        onChange={(e) => onChangeInput(e.target.value)}
        placeholder={t('chat.placeholder')}
        className="text-body-compact"
        containerClassName="rounded-2xl px-4 py-2 shadow-xl bg-surface-hover border-border-default"
        startIcon={
          <IconButton
            iconName="link"
            type="button"
            onClick={onAttachClick}
            title={t('chat.attachTitle')}
            className="hover:text-primary"
          />
        }
        endIcon={
          <div className="flex items-center gap-1 shrink-0">
            <IconButton
              iconName="mic"
              type="button"
              onClick={() =>
                onChangeInput('Find me a good lecture about the history of artificial intelligence...')
              }
              title={t('chat.voiceTitle')}
            />
            <IconButton
              iconName="arrow_upward"
              type="submit"
              variant="filled"
              size="sm"
              title={t('chat.sendTitle')}
              className="w-8 h-8 rounded-full"
            />
          </div>
        }
      />
      <div className="flex items-center justify-center text-caption-sm font-mono text-text-muted select-none">
        <span>{t('chat.footerHint')}</span>
      </div>
    </form>
  );
};
