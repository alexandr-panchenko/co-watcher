import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';

interface EvidenceBoxProps {
  detail?: string | undefined;
  sources?: string | undefined;
  impact?: string | undefined;
  onOpenFactCheck: () => void;
}

export const EvidenceBox: React.FC<EvidenceBoxProps> = ({
  detail,
  sources,
  impact,
  onOpenFactCheck: _onOpenFactCheck,
}) => {
  const { t } = useTranslation('session');
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);

  return (
    <div className="bg-surface-canvas/80 rounded-lg p-2 flex flex-col gap-1 border border-white/5 mt-0.5">
      <div className="flex items-center justify-between text-text-muted font-mono text-micro">
        <span className="flex items-center gap-1 text-primary truncate max-w-xs">
          <span className="material-symbols-outlined text-sm">menu_book</span>
          {sources || detail}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setEvidenceExpanded(!evidenceExpanded);
          }}
          className="text-primary hover:underline font-semibold p-0 h-auto font-mono text-micro"
        >
          {evidenceExpanded ? t('rail.collapseEvidence') : t('rail.expandEvidence')}
        </Button>
      </div>

      {evidenceExpanded && detail && (
        <p className="text-caption-sm text-text-secondary font-sans mt-1 p-2 rounded bg-surface-panel/80 border border-white/5 whitespace-pre-line leading-relaxed">
          {detail}
        </p>
      )}

      {impact && (
        <p className="text-caption-sm text-text-secondary font-sans mt-0.5">
          <span className="font-semibold text-text-primary">{t('rail.whyMatters')}</span>{' '}
          {impact}
        </p>
      )}
    </div>
  );
};
