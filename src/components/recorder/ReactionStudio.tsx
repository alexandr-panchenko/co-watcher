import React from 'react';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '../../data/mockData';
import { Button } from '../ui';

interface ReactionPreviewStageProps {
  recordedBlobUrl: string | null;
  cameraOn: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isRecordingActive: boolean;
  micAudioLevel: number;
}

export const ReactionPreviewStage: React.FC<ReactionPreviewStageProps> = ({
  recordedBlobUrl,
  cameraOn,
  videoRef,
  isRecordingActive,
  micAudioLevel,
}) => {
  const { t } = useTranslation('session');

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10 group">
      {recordedBlobUrl ? (
        <video
          src={recordedBlobUrl}
          controls
          playsInline
          className="w-full h-full object-cover"
        >
          <track kind="captions" />
        </video>
      ) : cameraOn ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          >
            <track kind="captions" />
          </video>
          <img
            src={ASSETS.studioCam}
            alt="Webcam fallback preview"
            className="w-full h-full object-cover absolute inset-0 -z-10"
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-muted">
          <span className="material-symbols-outlined text-4xl">videocam_off</span>
          <span className="font-mono text-xs">{t('recorder.mutedFeed')}</span>
        </div>
      )}

      {/* Live Recording Badge */}
      {!recordedBlobUrl && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs border border-white/10 font-mono text-micro text-white">
          <span
            className={`w-2 h-2 rounded-full ${
              isRecordingActive ? 'bg-rose-500 animate-ping' : 'bg-amber'
            }`}
          />
          <span>{isRecordingActive ? t('recorder.live') : t('recorder.paused')}</span>
        </div>
      )}

      {/* Live Audio Decibel Level */}
      {!recordedBlobUrl && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs p-1.5 rounded flex items-center gap-2 text-micro font-mono border border-white/10">
          <span className="material-symbols-outlined text-xs text-emerald-400">mic</span>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-100"
              style={{ width: `${micAudioLevel}%` }}
            />
          </div>
          <span className="text-zinc-300 w-8 text-right">-{100 - micAudioLevel}dB</span>
        </div>
      )}
    </div>
  );
};

interface ReactionStudioProps {
  recordingSeconds: number;
  isRecordingActive: boolean;
  cameraOn: boolean;
  micAudioLevel: number;
  targetTimestampFormatted: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordedBlobUrl: string | null;
  onToggleRecordActive: () => void;
  onRetake: () => void;
  onToggleCamera: () => void;
  onFinishAndAttach: () => void;
}

export const ReactionStudio: React.FC<ReactionStudioProps> = ({
  recordingSeconds,
  isRecordingActive,
  cameraOn,
  micAudioLevel,
  targetTimestampFormatted,
  videoRef,
  recordedBlobUrl,
  onToggleRecordActive,
  onRetake,
  onToggleCamera,
  onFinishAndAttach,
}) => {
  const { t } = useTranslation('session');

  return (
    <div className="bg-surface-canvas rounded-xl flex flex-col shadow-xl flex-1 h-full overflow-hidden border border-rose-500/30 p-3 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between py-1 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-sans text-sm font-semibold text-text-primary tracking-tight">
            {t('recorder.title')}
          </span>
        </div>
        <span className="font-mono text-xs text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
          {t('recorder.durationLimit', {
            seconds: recordingSeconds.toString().padStart(2, '0'),
          })}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1">
        <ReactionPreviewStage
          recordedBlobUrl={recordedBlobUrl}
          cameraOn={cameraOn}
          videoRef={videoRef}
          isRecordingActive={isRecordingActive}
          micAudioLevel={micAudioLevel}
        />

        {/* Studio Controls Row */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isRecordingActive ? 'amber' : 'secondary'}
            size="sm"
            onClick={onToggleRecordActive}
            icon={
              <span className="material-symbols-outlined text-sm">
                {isRecordingActive ? 'pause' : 'play_arrow'}
              </span>
            }
          >
            {isRecordingActive ? t('recorder.pause') : t('recorder.resume')}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onRetake}
            icon={<span className="material-symbols-outlined text-sm">replay</span>}
          >
            {t('recorder.retake')}
          </Button>

          <Button
            variant={cameraOn ? 'secondary' : 'danger'}
            size="sm"
            onClick={onToggleCamera}
            icon={
              <span className="material-symbols-outlined text-base">
                {cameraOn ? 'videocam' : 'videocam_off'}
              </span>
            }
          >
            {cameraOn ? t('recorder.camOn') : t('recorder.camOff')}
          </Button>
        </div>

        {/* Done & Attach Button */}
        <Button
          variant="primary"
          size="md"
          onClick={onFinishAndAttach}
          className="w-full"
          icon={<span className="material-symbols-outlined text-base">check</span>}
        >
          {t('recorder.doneAttach', { time: targetTimestampFormatted })}
        </Button>

        {/* AI Context at Target Timestamp Note */}
        <div className="bg-surface-card rounded-xl p-2.5 flex flex-col gap-1.5 border border-border-default shrink-0 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-micro uppercase tracking-wider text-text-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">
                psychology
              </span>
              {t('recorder.aiContextTitle', { time: targetTimestampFormatted })}
            </span>
            <span className="px-1.5 py-0.5 bg-primary-container/20 text-primary font-mono text-nano font-bold rounded uppercase">
              {t('recorder.factCheck')}
            </span>
          </div>
          <h4 className="font-sans text-xs text-primary font-semibold leading-snug">
            {t('recorder.breakthroughTitle')}
          </h4>
          <p className="font-sans text-caption-sm text-text-secondary leading-tight">
            {t('recorder.breakthroughDesc')}
          </p>
          <div className="pt-1.5 border-t border-white/5 flex items-start gap-1 text-micro text-text-muted">
            <span className="material-symbols-outlined text-caption-sm text-secondary">
              verified
            </span>
            <span>{t('recorder.whyMattersText')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
