import React from 'react';
import { useTranslation } from 'react-i18next';
import { ASSETS } from '../../../data/mockData';
import { TimelineAnchor } from '../../../types';
import { Button } from '../../ui';

interface ReactionAnchorCardProps {
  anchor: TimelineAnchor;
  onNavigateToAssembly: () => void;
  onRetakeReaction: () => void;
}

export const ReactionAnchorCard: React.FC<ReactionAnchorCardProps> = ({
  anchor,
  onNavigateToAssembly,
  onRetakeReaction,
}) => {
  const { t } = useTranslation('session');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="p-3 rounded-xl bg-surface-hover border border-amber/60 shadow-glow-amber flex flex-col gap-2 relative animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded font-mono text-caption-sm font-bold flex items-center gap-1 bg-amber-container/20 text-amber border border-amber/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {anchor.timeFormatted}
          </span>
          <span className="px-1.5 py-0.5 font-mono text-micro rounded uppercase font-bold tracking-wide bg-amber text-surface-card">
            {t('rail.myReaction')}
          </span>
          <span className="flex items-center gap-1 font-mono text-micro font-semibold text-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            {t('rail.nowSelected')}
          </span>
        </div>
        <span className="material-symbols-outlined text-amber text-lg">videocam</span>
      </div>

      <div className="flex items-center gap-1.5 text-caption-sm font-mono text-text-muted bg-surface-canvas/70 px-2 py-1 rounded-lg">
        <span className="material-symbols-outlined text-sm text-primary">reply</span>
        <span className="truncate">
          {t('rail.reactionTo', { context: '“Vaswani & Shazeer breakthrough”' })}
        </span>
      </div>

      <h3 className="font-sans text-body-compact text-text-primary font-semibold leading-snug">
        {anchor.title}
      </h3>

      {/* Webcam thumbnail preview */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10 group">
        <img src={ASSETS.studioCam} alt="Reaction preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-xl ml-0.5">play_arrow</span>
          </div>
        </div>
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-nano font-mono text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          <span>{t('rail.camBadge')}</span>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/90 backdrop-blur-md text-micro font-mono text-white">
          {anchor.reactionDuration}
        </div>
      </div>

      {/* Transcript excerpt */}
      <div className="bg-surface-canvas/90 rounded-lg p-2 flex flex-col gap-1 border border-white/5">
        <div className="flex items-center justify-between text-text-muted font-mono text-caption-sm">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber">graphic_eq</span>
            <span>{t('rail.transcriptExcerpt')}</span>
          </div>
          <span className="text-secondary text-micro font-semibold">{t('rail.exactMatch')}</span>
        </div>
        <p className="font-sans text-caption-sm text-text-secondary leading-relaxed italic">
          {anchor.transcriptExcerpt}
        </p>
      </div>

      {/* Quick Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="amber"
          size="sm"
          onClick={onNavigateToAssembly}
          className="flex-1"
          icon={<span className="material-symbols-outlined text-sm">movie_edit</span>}
        >
          {tCommon('actions.useInReactionCut')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetakeReaction}
          icon={<span className="material-symbols-outlined text-sm">replay</span>}
        >
          {tCommon('actions.reRecord')}
        </Button>
      </div>
    </div>
  );
};
