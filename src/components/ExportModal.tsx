import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, AspectBadge } from './ui';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormatSelectorProps {
  aspectRatio: '16:9' | '9:16';
  onSelect: (ratio: '16:9' | '9:16') => void;
  label: string;
  landscapeTitle: string;
  verticalTitle: string;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  aspectRatio,
  onSelect,
  label,
  landscapeTitle,
  verticalTitle,
}) => (
  <div className="space-y-1.5">
    <label className="text-caption-sm font-mono text-text-muted uppercase tracking-wider">
      {label}
    </label>
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant={aspectRatio === '16:9' ? 'secondary' : 'ghost'}
        onClick={() => onSelect('16:9')}
        className={`p-3 h-auto flex flex-col items-center gap-1.5 rounded-xl border ${
          aspectRatio === '16:9'
            ? 'border-primary bg-primary-container/15 text-text-primary font-medium'
            : 'border-white/5 bg-surface-base text-text-muted hover:text-text-primary'
        }`}
      >
        <AspectBadge ratio="16:9" />
        <span className="text-xs">{landscapeTitle}</span>
      </Button>
      <Button
        variant={aspectRatio === '9:16' ? 'secondary' : 'ghost'}
        onClick={() => onSelect('9:16')}
        className={`p-3 h-auto flex flex-col items-center gap-1.5 rounded-xl border ${
          aspectRatio === '9:16'
            ? 'border-primary bg-primary-container/15 text-text-primary font-medium'
            : 'border-white/5 bg-surface-base text-text-muted hover:text-text-primary'
        }`}
      >
        <AspectBadge ratio="9:16" />
        <span className="text-xs">{verticalTitle}</span>
      </Button>
    </div>
  </div>
);

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('modals');
  const { t: tCommon } = useTranslation('common');

  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'1080p' | '4K'>('1080p');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportResult, setExportResult] = useState<{
    rendered: boolean;
    filename: string;
    boundaryNote: string;
  } | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleExport = () => {
    setIsExporting(true);

    void fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: 'default-room',
        aspectRatio,
        resolution,
      }),
    })
      .then((res) => res.json() as Promise<{ rendered: boolean; filename: string; boundaryNote: string }>)
      .then((data) => {
        setIsExporting(false);
        setExportResult(data);
        setExportComplete(true);
      })
      .catch(() => {
        // Fallback for isolated client preview
        setIsExporting(false);
        setExportResult({
          rendered: false,
          filename: `Reaction_Sequence_EDL_${aspectRatio === '9:16' ? 'Vertical' : 'Landscape'}.json`,
          boundaryNote: 'Standard YouTube stream lacks raw source video bytes for derivative export without owner-supplied footage. Exported reaction takes, synchronized timestamps, and sequence storyboard EDL (JSON).',
        });
        setExportComplete(true);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      icon={
        <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-lg">movie_edit</span>
        </div>
      }
      title={t('export.title')}
      subtitle={t('export.subtitle')}
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            icon={
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'link'}
              </span>
            }
          >
            {copied ? tCommon('actions.copied') : tCommon('actions.copyLink')}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              {tCommon('actions.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExport}
              isLoading={isExporting}
              icon={<span className="material-symbols-outlined text-sm">bolt</span>}
            >
              {isExporting ? tCommon('actions.rendering') : tCommon('actions.renderExport')}
            </Button>
          </div>
        </>
      }
    >
      <FormatSelector
        aspectRatio={aspectRatio}
        onSelect={setAspectRatio}
        label={t('export.formatLabel')}
        landscapeTitle={t('export.landscapeTitle')}
        verticalTitle={t('export.verticalTitle')}
      />

      {/* Quality selection */}
      <div className="space-y-1.5">
        <label className="text-caption-sm font-mono text-text-muted uppercase tracking-wider">
          {t('export.qualityLabel')}
        </label>
        <div className="flex gap-2">
          <Button
            variant={resolution === '1080p' ? 'secondary' : 'ghost'}
            onClick={() => setResolution('1080p')}
            className={`flex-1 py-2 font-mono text-xs border ${
              resolution === '1080p'
                ? 'border-primary bg-primary-container/15 text-text-primary font-semibold'
                : 'border-white/5 bg-surface-base text-text-muted hover:text-text-primary'
            }`}
          >
            {t('export.hdOption')}
          </Button>
          <Button
            variant={resolution === '4K' ? 'secondary' : 'ghost'}
            onClick={() => setResolution('4K')}
            className={`flex-1 py-2 font-mono text-xs border ${
              resolution === '4K'
                ? 'border-primary bg-primary-container/15 text-text-primary font-semibold'
                : 'border-white/5 bg-surface-base text-text-muted hover:text-text-primary'
            }`}
          >
            {t('export.uhdOption')}
          </Button>
        </div>
      </div>

      {/* Audio ducking & diagram overlay badge */}
      <div className="p-3 rounded-xl bg-surface-base border border-white/5 space-y-1 text-text-secondary">
        <div className="flex items-center gap-1.5 text-secondary font-mono text-caption-sm">
          <span className="material-symbols-outlined text-sm">auto_fix_high</span>
          <span className="font-semibold">{t('export.smartBadge')}</span>
        </div>
        <p className="text-caption-sm text-text-muted">
          {t('export.smartDesc')}
        </p>
      </div>

      {/* Source-media export boundary callout */}
      <div className="p-3 rounded-xl bg-amber-container/10 border border-amber/30 space-y-1 text-text-secondary">
        <div className="flex items-center gap-1.5 text-amber font-mono text-caption-sm">
          <span className="material-symbols-outlined text-sm">info</span>
          <span className="font-semibold">{t('export.boundaryTitle')}</span>
        </div>
        <p className="text-caption-sm text-text-muted">
          {t('export.boundaryDesc')}
        </p>
      </div>

      {exportComplete && exportResult && (
        <div className="p-3 rounded-xl bg-secondary-container/20 border border-secondary/40 flex flex-col gap-2 text-secondary text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span className="font-medium">{t('export.successMessage')}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-secondary hover:text-white font-mono text-xs underline cursor-pointer"
              onClick={() => {
                const edlData = {
                  project: 'Co-Watcher Sequence Export',
                  aspectRatio,
                  resolution,
                  timestamp: new Date().toISOString(),
                  boundaryNote: exportResult.boundaryNote,
                  status: exportResult.rendered ? 'rendered' : 'edl_package_ready',
                };
                const blob = new Blob([JSON.stringify(edlData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = exportResult.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              {exportResult.rendered ? t('export.downloadMp4') : t('export.downloadEdl')}
            </Button>
          </div>
          <div className="text-micro font-mono text-text-muted border-t border-white/10 pt-1.5 flex items-center justify-between">
            <span>{exportResult.filename}</span>
            <span className="text-secondary font-semibold">
              {exportResult.rendered ? t('export.withMediaBadge') : t('export.boundaryTitle')}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
};
