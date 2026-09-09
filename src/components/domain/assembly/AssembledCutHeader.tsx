import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScreenType } from '../../../types';
import { Button } from '../../ui';

interface AssembledCutHeaderProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenExport: () => void;
}

export const AssembledCutHeader: React.FC<AssembledCutHeaderProps> = ({
  onNavigate,
  onOpenExport,
}) => {
  const { t } = useTranslation('assembly');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="w-full bg-surface-panel border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between z-10 flex-wrap gap-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('session')}
          className="text-text-muted hover:text-text-primary font-mono text-xs"
          icon={<span className="material-symbols-outlined text-base">arrow_back</span>}
        >
          {tCommon('actions.backToVideo')}
        </Button>
        <span className="text-text-muted">•</span>
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm md:text-base font-semibold text-text-primary">
            {t('header.title')}
          </span>
          <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-mono text-micro font-bold uppercase">
            {t('header.status')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('session')}
          icon={<span className="material-symbols-outlined text-base">videocam</span>}
        >
          {tCommon('actions.reRecord')}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenExport}
          icon={<span className="material-symbols-outlined text-base">ios_share</span>}
        >
          {tCommon('actions.exportVideo')}
        </Button>
      </div>
    </div>
  );
};
