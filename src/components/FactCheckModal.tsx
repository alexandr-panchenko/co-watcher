import React from 'react';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '../data/mockData';
import { Modal, Button } from './ui';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FactCheckModal: React.FC<FactCheckModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('modals');
  const { t: tCommon } = useTranslation('common');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      icon={
        <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center border border-secondary/30">
          <span className="material-symbols-outlined text-xl">verified</span>
        </div>
      }
      title={t('factCheck.title')}
      subtitle={
        <span className="flex items-center gap-2">
          <span className="text-secondary font-bold uppercase">{t('factCheck.verifiedBadge')}</span>
          <span>•</span>
          <span>{t('factCheck.anchor')}</span>
        </span>
      }
      footer={
        <>
          <span className="text-caption-sm text-text-muted font-mono">
            {t('factCheck.footerStatus')}
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            {tCommon('actions.done')}
          </Button>
        </>
      }
    >
      {/* Paper Reference Card */}
      <div className="bg-surface-base rounded-xl p-3.5 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-text-muted font-mono text-caption-sm">
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            arXiv:1706.03762v7 [cs.CL]
          </span>
          <span>{t('factCheck.paperDate')}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary">{t('factCheck.paperTitle')}</h3>
        <p className="text-text-muted text-caption-sm">
          {t('factCheck.paperAuthors')}
        </p>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-caption-sm text-text-muted">
          <span>{t('factCheck.paperAffiliations')}</span>
          <span className="text-secondary font-medium">{t('factCheck.paperStatus')}</span>
        </div>
      </div>

      {/* Equation & Diagram Preview */}
      <div className="bg-surface-panel rounded-xl p-4 border border-primary-container/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-caption-sm uppercase tracking-wider text-primary font-semibold">
            {t('factCheck.mathTitle')}
          </span>
          <span className="text-micro font-mono text-text-muted">{t('factCheck.section')}</span>
        </div>
        <div className="bg-black/60 p-3 rounded-lg font-mono text-center text-sm text-secondary border border-white/5 tracking-wider overflow-x-auto">
          {t('factCheck.attentionEquation')}
        </div>
        <p className="text-text-secondary text-caption-sm">
          <strong className="text-text-primary">{t('factCheck.whyScaleMatters')}</strong>{' '}
          {t('factCheck.whyScaleDesc')}
        </p>
      </div>

      {/* Diagram preview thumbnail */}
      <div className="rounded-xl overflow-hidden border border-white/10 relative">
        <img
          src={ASSETS.diagram}
          alt={t('factCheck.diagramFig')}
          className="w-full h-44 object-contain bg-surface-canvas p-2"
        />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-micro font-mono text-text-secondary">
          {t('factCheck.diagramFig')}
        </div>
      </div>

      {/* Co-Authorship Historical Fact-Check Notes */}
      <div className="space-y-2">
        <h4 className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber text-base">history_edu</span>
          {t('factCheck.historyTitle')}
        </h4>
        <div className="space-y-1.5 text-text-secondary">
          <div className="flex items-start gap-2 bg-surface-base p-2.5 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
            <p>
              <strong className="text-text-primary">{t('factCheck.shazeerName')}</strong> {t('factCheck.shazeerRole')}
            </p>
          </div>
          <div className="flex items-start gap-2 bg-surface-base p-2.5 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
            <p>
              <strong className="text-text-primary">{t('factCheck.parmarVaswaniName')}</strong> {t('factCheck.parmarVaswaniRole')}
            </p>
          </div>
          <div className="flex items-start gap-2 bg-surface-base p-2.5 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple mt-1.5 shrink-0" />
            <p>
              <strong className="text-text-primary">{t('factCheck.computeHardwareName')}</strong> {t('factCheck.computeHardware')}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
