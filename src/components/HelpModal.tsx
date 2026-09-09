import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from './ui';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('modals');
  const { t: tCommon } = useTranslation('common');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      icon={
        <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center border border-primary/30">
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </div>
      }
      title={t('help.title')}
      subtitle={t('help.subtitle')}
      footer={
        <div className="w-full flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            {tCommon('actions.gotIt')}
          </Button>
        </div>
      }
    >
      <div className="space-y-1">
        <h3 className="text-text-primary font-semibold text-sm">{t('help.heading')}</h3>
        <p className="text-text-muted text-caption-md">
          {t('help.intro')}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-surface-base p-3 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">
            schedule
          </span>
          <div>
            <strong className="text-text-primary block text-xs">{t('help.step1Title')}</strong>
            <p className="text-text-muted text-caption-sm mt-0.5">
              {t('help.step1Desc')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-surface-base p-3 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">
            verified
          </span>
          <div>
            <strong className="text-text-primary block text-xs">{t('help.step2Title')}</strong>
            <p className="text-text-muted text-caption-sm mt-0.5">
              {t('help.step2Desc')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-surface-base p-3 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-amber text-lg shrink-0 mt-0.5">
            videocam
          </span>
          <div>
            <strong className="text-text-primary block text-xs">{t('help.step3Title')}</strong>
            <p className="text-text-muted text-caption-sm mt-0.5">
              {t('help.step3Desc')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-surface-base p-3 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">
            movie_edit
          </span>
          <div>
            <strong className="text-text-primary block text-xs">{t('help.step4Title')}</strong>
            <p className="text-text-muted text-caption-sm mt-0.5">
              {t('help.step4Desc')}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
