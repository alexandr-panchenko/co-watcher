import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../ui';

interface SessionRecordingBannerProps {
  pausedTimeFormatted: string;
  onClose: () => void;
}

export const SessionRecordingBanner: React.FC<SessionRecordingBannerProps> = ({
  pausedTimeFormatted,
  onClose,
}) => {
  const { t } = useTranslation('session');

  return (
    <div className="w-full bg-surface-panel border-b border-rose-500/40 px-4 md:px-6 py-2.5 flex items-center justify-between z-30 shadow-lg text-xs animate-fade-in">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-micro font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          {t('banner.recMode')}
        </span>
        <span className="font-semibold text-text-primary">{t('banner.recordingTo')}</span>
        <span className="text-text-muted">•</span>
        <span className="font-mono text-text-secondary">{t('banner.timeRange')}</span>
        <span className="text-text-muted">•</span>
        <span className="text-text-secondary truncate max-w-sm">
          {t('banner.context')}
        </span>
        <span className="text-text-muted">•</span>
        <span className="text-amber font-mono text-caption-sm">
          {t('banner.pausedAt', { time: pausedTimeFormatted })}
        </span>
      </div>
      <IconButton
        iconName="close"
        size="sm"
        onClick={onClose}
        title={t('banner.closeTitle')}
        className="text-text-muted hover:text-text-primary"
      />
    </div>
  );
};
