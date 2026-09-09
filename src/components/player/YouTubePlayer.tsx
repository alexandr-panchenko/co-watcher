import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Button, Slider } from '../ui';

interface YouTubePlayerProps {
  containerId: string;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  isReady: boolean;
  hasReaction?: boolean;
  onTogglePlay: () => void;
  onSeek: (timeSec: number) => void;
  onToggleSpeed: () => void;
  onToggleMute: () => void;
  onVolumeChange: (val: number) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  containerId,
  isPlaying,
  currentTimeSec,
  durationSec,
  playbackSpeed,
  volume,
  isMuted,
  isReady,
  hasReaction = false,
  onTogglePlay,
  onSeek,
  onToggleSpeed,
  onToggleMute,
  onVolumeChange,
}) => {
  const { t } = useTranslation('session');

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div className="relative w-full aspect-video bg-surface-canvas rounded-xl overflow-hidden shadow-2xl border border-white/10 group select-none">
      {/* Real YouTube IFrame Container */}
      <div className="w-full h-full pointer-events-none">
        <div id={containerId} className="w-full h-full" />
      </div>

      {/* Transparent Click Overlay to trigger play/pause */}
      <div
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? t('player.pause') : t('player.play')}
        onClick={onTogglePlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTogglePlay();
          }
        }}
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center transition-all bg-transparent hover:bg-black/10"
      >
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
          </div>
        )}
      </div>

      {/* Top Floating Badges */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-auto z-20">
        <div className="bg-surface-canvas/85 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-2 text-white border border-white/10 shadow-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              hasReaction ? 'bg-amber' : 'bg-rose-500'
            } animate-pulse`}
          />
          <span className="font-mono text-xs tracking-wide">
            {t('player.sync', { time: formatTime(currentTimeSec) })}
          </span>
          {isReady && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title={t('player.ready')} />
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleSpeed}
          className="bg-surface-canvas/75 backdrop-blur-md font-mono text-xs text-text-secondary hover:text-white border-white/10"
          title={t('player.toggleSpeed')}
          icon={<span className="material-symbols-outlined text-sm">speed</span>}
        >
          {t('player.speedValue', { speed: playbackSpeed })}
        </Button>
      </div>

      {/* Bottom Scrubber & Transport Controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-surface-canvas via-surface-canvas/85 to-transparent flex flex-col gap-2 z-20 pointer-events-auto">
        {/* Scrubber bar */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Video timeline scrubber"
          aria-valuenow={currentTimeSec}
          aria-valuemin={0}
          aria-valuemax={durationSec}
          className="relative w-full h-4 flex items-center cursor-pointer group/scrub"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            onSeek(Math.floor(pos * durationSec));
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(currentTimeSec + 5, durationSec));
            if (e.key === 'ArrowLeft') onSeek(Math.max(currentTimeSec - 5, 0));
          }}
        >
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover/scrub:h-1.5 transition-all">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md -ml-1.5 opacity-0 group-hover/scrub:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Transport controls row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <IconButton
              iconName={isPlaying ? 'pause' : 'play_arrow'}
              onClick={onTogglePlay}
              title={isPlaying ? t('player.pause') : t('player.play')}
            />
            <IconButton
              iconName="replay"
              onClick={() => onSeek(Math.max(0, currentTimeSec - 10))}
              title={t('player.rewind10')}
            />
            <IconButton
              iconName="forward_10"
              onClick={() => onSeek(Math.min(durationSec, currentTimeSec + 10))}
              title={t('player.forward10')}
            />

            {/* Volume slider control */}
            <div className="flex items-center gap-1 ml-2">
              <IconButton
                iconName={isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
                onClick={onToggleMute}
                title={t('player.toggleMute')}
              />
              <div className="w-20">
                <Slider
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChangeValue={onVolumeChange}
                  aria-label="Volume slider"
                />
              </div>
            </div>

            <span className="font-mono text-xs text-text-muted ml-2">
              {formatTime(currentTimeSec)} / {formatTime(durationSec)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              iconName="subtitles"
              title={t('player.subtitles')}
            />
            <IconButton
              iconName="settings"
              title={t('player.settings')}
            />
            <IconButton
              iconName="fullscreen"
              title={t('player.fullscreen')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
