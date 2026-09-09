import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Button } from '../../ui';
import { CutCompositionCanvas } from './CutCompositionCanvas';

interface CutStagePreviewProps {
  layoutMode: 'pip' | 'split' | 'fullscreen-diagram';
  isPlaying: boolean;
  currentTimeSec: number;
  totalLengthSec: number;
  duckingActive: boolean;
  animatedCaptions: boolean;
  reactionBlobUrl?: string | null | undefined;
  onTogglePlay: () => void;
  onSeek: (timeSec: number) => void;
  onToggleDucking: () => void;
  onToggleCaptions: () => void;
}

export const CutStagePreview: React.FC<CutStagePreviewProps> = ({
  layoutMode,
  isPlaying,
  currentTimeSec,
  totalLengthSec,
  duckingActive,
  animatedCaptions,
  reactionBlobUrl,
  onTogglePlay,
  onSeek,
  onToggleDucking,
  onToggleCaptions,
}) => {
  const { t } = useTranslation('assembly');

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTimeSec / totalLengthSec) * 100;

  return (
    <div className="relative w-full aspect-video bg-surface-canvas rounded-xl overflow-hidden shadow-2xl border border-white/10 group select-none flex flex-col justify-between">
      <CutCompositionCanvas
        layoutMode={layoutMode}
        animatedCaptions={animatedCaptions}
        reactionBlobUrl={reactionBlobUrl}
      />

      {/* Transport & Timeline Scrubber */}
      <div className="p-4 bg-gradient-to-t from-surface-canvas via-surface-canvas/90 to-transparent flex flex-col gap-2 z-30">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Timeline scrubber"
          aria-valuenow={currentTimeSec}
          aria-valuemin={0}
          aria-valuemax={totalLengthSec}
          className="relative w-full h-3 flex items-center cursor-pointer group/scrub"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            onSeek(Math.floor(pos * totalLengthSec));
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(currentTimeSec + 5, totalLengthSec));
            if (e.key === 'ArrowLeft') onSeek(Math.max(currentTimeSec - 5, 0));
          }}
        >
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover/scrub:h-1.5 transition-all">
            <div
              className="h-full bg-amber transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber shadow-md -ml-1.5"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Transport controls row */}
        <div className="flex items-center justify-between text-text-primary text-xs">
          <div className="flex items-center gap-2">
            <IconButton
              iconName={isPlaying ? 'pause' : 'play_arrow'}
              onClick={onTogglePlay}
              title={isPlaying ? t('preview.pauseTitle') : t('preview.playTitle')}
            />
            <IconButton
              iconName="replay"
              onClick={() => onSeek(0)}
              title={t('preview.restartTitle')}
            />
            <span className="font-mono text-xs text-text-muted ml-1">
              <strong className="text-text-primary">{formatTime(currentTimeSec)}</strong> /{' '}
              {formatTime(totalLengthSec)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <Button
              variant={duckingActive ? 'secondary' : 'ghost'}
              size="sm"
              onClick={onToggleDucking}
              className={`font-mono text-caption-sm ${
                duckingActive
                  ? 'border-secondary/60 bg-secondary-container/20 text-secondary'
                  : 'text-text-muted'
              }`}
              title={t('preview.duckingTitle')}
              icon={<span className="material-symbols-outlined text-xs">graphic_eq</span>}
            >
              {duckingActive ? t('preview.duckingOn') : t('preview.duckingOff')}
            </Button>

            <Button
              variant={animatedCaptions ? 'secondary' : 'ghost'}
              size="sm"
              onClick={onToggleCaptions}
              className={`font-mono text-caption-sm ${
                animatedCaptions
                  ? 'border-primary/60 bg-primary-container/20 text-primary'
                  : 'text-text-muted'
              }`}
              icon={<span className="material-symbols-outlined text-xs">closed_caption</span>}
            >
              {t('preview.subtitles')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
