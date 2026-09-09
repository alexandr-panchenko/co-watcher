import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimelineAnchor } from '../../types';
import { Button } from '../ui';
import { ReactionAnchorCard } from '../domain/session/ReactionAnchorCard';
import { EvidenceBox } from './EvidenceBox';

interface RichCommentCardProps {
  anchor: TimelineAnchor;
  isSelected: boolean;
  onSelect: () => void;
  onOpenFactCheck: () => void;
  onNavigateToAssembly?: () => void;
  onRetakeReaction?: () => void;
}

interface CardHeaderProps {
  timeFormatted: string;
  categoryLabel: string;
  isFactCheck: boolean;
  isSelected: boolean;
  hasEvidence: boolean;
  onOpenFactCheck: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  timeFormatted,
  categoryLabel,
  isFactCheck,
  isSelected,
  hasEvidence,
  onOpenFactCheck,
}) => {
  const { t } = useTranslation('session');
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span
          className={`px-1.5 py-0.5 rounded font-mono text-caption-sm font-bold flex items-center gap-1 ${
            isSelected
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-hover text-text-secondary'
          }`}
        >
          {timeFormatted}
        </span>
        <span
          className={`px-1.5 py-0.5 font-mono text-micro rounded uppercase font-semibold ${
            isFactCheck
              ? 'bg-secondary-container/20 text-secondary'
              : 'bg-white/5 text-text-secondary'
          }`}
        >
          {categoryLabel}
        </span>
        {isSelected && (
          <span className="flex items-center gap-1 font-mono text-micro text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
            {t('rail.nowPlaying')}
          </span>
        )}
      </div>
      {hasEvidence && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFactCheck();
          }}
          className="text-primary hover:underline text-caption-sm font-mono font-semibold p-0 h-auto"
        >
          {tCommon('actions.verify')}
        </Button>
      )}
    </div>
  );
};

export const RichCommentCard: React.FC<RichCommentCardProps> = ({
  anchor,
  isSelected,
  onSelect,
  onOpenFactCheck,
  onNavigateToAssembly,
  onRetakeReaction,
}) => {
  if (anchor.isReaction) {
    return (
      <ReactionAnchorCard
        anchor={anchor}
        onNavigateToAssembly={onNavigateToAssembly ?? (() => {})}
        onRetakeReaction={onRetakeReaction ?? (() => {})}
      />
    );
  }

  const isFactCheck = anchor.category === 'fact-check';
  const displayImage = anchor.imageUrl || anchor.thumbnail;
  const hasEvidence = Boolean(anchor.detail || anchor.sources);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${anchor.timeFormatted} ${anchor.categoryLabel} ${anchor.title}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative text-left ${
        isSelected
          ? 'bg-surface-hover border-primary shadow-glow-sapphire'
          : 'bg-surface-card border-white/5 hover:border-white/20'
      }`}
    >
      <CardHeader
        timeFormatted={anchor.timeFormatted}
        categoryLabel={anchor.categoryLabel}
        isFactCheck={isFactCheck}
        isSelected={isSelected}
        hasEvidence={hasEvidence}
        onOpenFactCheck={onOpenFactCheck}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-sans text-body-compact font-semibold leading-snug ${
              isSelected ? 'text-primary' : 'text-text-primary'
            }`}
          >
            {anchor.title}
          </h3>
          <p className="font-sans text-caption-sm text-text-muted mt-0.5 leading-snug">
            {anchor.summary}
          </p>
        </div>
        {displayImage && (
          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black shadow-xs">
            <img src={displayImage} alt={anchor.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {hasEvidence && (
        <EvidenceBox
          detail={anchor.detail}
          sources={anchor.sources}
          impact={anchor.impact}
          onOpenFactCheck={onOpenFactCheck}
        />
      )}
    </div>
  );
};
