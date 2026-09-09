import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../../types';
import { IconButton, Input, Button } from '../ui';

interface UnifiedComposerChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onSendMessage: (text: string) => void;
  onLoadYouTubeUrl?: (url: string) => void;
}

export const UnifiedComposerChat: React.FC<UnifiedComposerChatProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
  onLoadYouTubeUrl,
}) => {
  const { t } = useTranslation('session');
  const [inputText, setInputText] = useState('');

  const suggestions = [
    { key: 'breakthrough', text: t('chat.pills.breakthrough') },
    { key: 'factCheck', text: t('chat.pills.factCheck') },
    { key: 'compare', text: t('chat.pills.compare') },
    { key: 'recommend', text: t('chat.pills.recommend') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Check if input is a YouTube URL
    const isYouTubeUrl =
      trimmed.includes('youtube.com/watch') ||
      trimmed.includes('youtu.be/') ||
      trimmed.includes('youtube.com/embed/');

    if (isYouTubeUrl && onLoadYouTubeUrl) {
      onLoadYouTubeUrl(trimmed);
    } else {
      onSendMessage(trimmed);
    }

    setInputText('');
  };

  const handleSelectPill = (pillText: string) => {
    setInputText(pillText);
  };

  return (
    <div className="w-full bg-surface-base border-t border-white/5 py-3 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Suggestion Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {suggestions.map((sug) => (
            <Button
              key={sug.key}
              variant="secondary"
              size="sm"
              onClick={() => handleSelectPill(sug.text)}
              className="text-caption-sm font-sans shrink-0 bg-surface-card hover:bg-surface-hover border-white/10"
              icon={<span className="material-symbols-outlined text-xs text-primary">auto_awesome</span>}
            >
              {sug.text}
            </Button>
          ))}
        </div>

        {/* Message Stream */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
            {messages.map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 text-xs font-sans ${
                    isUser ? 'justify-end text-text-primary' : 'justify-start text-text-secondary'
                  }`}
                >
                  {!isUser && (
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary font-mono text-nano shrink-0 font-bold">
                      AI
                    </span>
                  )}
                  <div
                    className={`px-3 py-1.5 rounded-xl max-w-xl ${
                      isUser
                        ? 'bg-primary-container text-white rounded-br-none'
                        : 'bg-surface-panel border border-white/5 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unified Input Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chat.placeholder')}
            startIcon={
              <span className="material-symbols-outlined text-base text-primary">
                {inputText.includes('youtube') || inputText.includes('youtu.be') ? 'link' : 'tune'}
              </span>
            }
            endIcon={
              <div className="flex items-center gap-1">
                {isLoading && (
                  <span className="material-symbols-outlined text-sm text-primary animate-spin">
                    progress_activity
                  </span>
                )}
                <IconButton
                  iconName="mic"
                  type="button"
                  size="sm"
                  onClick={() =>
                    setInputText(t('chat.pills.breakthrough'))
                  }
                  title={t('chat.voiceTitle')}
                />
                <IconButton
                  iconName="arrow_upward"
                  type="submit"
                  variant="filled"
                  size="sm"
                  title={t('chat.sendTitle')}
                  className="w-7 h-7 rounded-full"
                  disabled={isLoading || !inputText.trim()}
                />
              </div>
            }
          />
          <div className="flex items-center justify-between text-caption-sm font-mono text-text-muted px-2">
            <span>{t('chat.footerHint')}</span>
            <span>{t('chat.newLineHint')}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
