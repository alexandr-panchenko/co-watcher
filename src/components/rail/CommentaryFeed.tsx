import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimelineAnchor } from '../../types';
import { RichCommentCard } from './RichCommentCard';
import { Button, IconButton } from '../ui';

interface CommentaryFeedProps {
  anchors: TimelineAnchor[];
  activeAnchorId: string;
  selectedTag: string;
  autoScroll: boolean;
  onSelectAnchor: (anchor: TimelineAnchor) => void;
  onToggleTag: () => void;
  onToggleAutoScroll: () => void;
  onOpenFactCheck: () => void;
  onNavigateToAssembly: () => void;
  onRetakeReaction: () => void;
}

export const CommentaryFeed: React.FC<CommentaryFeedProps> = ({
  anchors,
  activeAnchorId,
  selectedTag,
  autoScroll,
  onSelectAnchor,
  onToggleTag,
  onToggleAutoScroll,
  onOpenFactCheck,
  onNavigateToAssembly,
  onRetakeReaction,
}) => {
  const { t } = useTranslation('session');

  return (
    <div className="bg-surface-canvas rounded-xl flex flex-col shadow-xl flex-1 h-full overflow-hidden border border-white/5 p-3 gap-2">
      {/* Header */}
      <div className="flex items-center justify-between py-1 border-b border-border-default">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-text-primary tracking-tight">
            {t('rail.title')}
          </span>
          <span className="px-2 py-0.5 bg-surface-hover rounded-full font-mono text-caption-sm text-text-secondary">
            {anchors.length}
          </span>
          {autoScroll && (
            <span className="flex items-center gap-1 font-mono text-micro text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {t('rail.sync')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleTag}
            className="px-2 py-0.5 text-caption-sm font-mono"
            title={t('rail.filterTags')}
            icon={<span className="material-symbols-outlined text-sm">filter_list</span>}
          >
            {selectedTag}
          </Button>
          <IconButton
            iconName="sync"
            size="sm"
            onClick={onToggleAutoScroll}
            className={autoScroll ? 'text-secondary bg-secondary/10' : 'text-text-muted hover:text-text-secondary'}
            title={t('rail.autoScroll')}
          />
        </div>
      </div>

      {/* Feed Cards List */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {anchors.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-text-muted gap-3 my-auto">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">
              progress_activity
            </span>
            <p className="font-sans text-xs max-w-xs">{t('rail.analyzing')}</p>
          </div>
        ) : (
          anchors.map((anchor) => (
            <RichCommentCard
              key={anchor.id}
              anchor={anchor}
              isSelected={anchor.id === activeAnchorId}
              onSelect={() => onSelectAnchor(anchor)}
              onOpenFactCheck={onOpenFactCheck}
              onNavigateToAssembly={onNavigateToAssembly}
              onRetakeReaction={onRetakeReaction}
            />
          ))
        )}
      </div>
    </div>
  );
};
