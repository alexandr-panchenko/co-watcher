import React from 'react';
import { useTranslation } from 'react-i18next';
import { SequenceBlock } from '../../../types';
import { Card, Badge } from '../../ui';

interface SequenceTimelineProps {
  blocks: SequenceBlock[];
  selectedBlockId: string;
  onSelectBlock: (blockId: string, startSec: number) => void;
}

export const SequenceTimeline: React.FC<SequenceTimelineProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
}) => {
  const { t } = useTranslation('assembly');

  return (
    <Card variant="panel" className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border-default pb-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-text-primary">
            {t('timeline.title')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-card font-mono text-caption-sm text-primary">
            {t('timeline.meta')}
          </span>
        </div>
        <span className="text-caption-sm font-mono text-text-muted">
          {t('timeline.syncHint')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {blocks.map((block) => {
          const isSelected = block.id === selectedBlockId;
          const isReaction = block.type === 'HUMAN VOICE & CAM';
          const isDiagram = block.type === 'AI CONTEXT OVERLAY';

          return (
            <div
              key={block.id}
              role="button"
              tabIndex={0}
              aria-label={block.title}
              onClick={() => onSelectBlock(block.id, block.startSec)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectBlock(block.id, block.startSec);
                }
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                isSelected
                  ? isReaction
                    ? 'bg-surface-hover border-amber shadow-glow-amber'
                    : 'bg-surface-hover border-primary shadow-glow-sapphire'
                  : 'bg-surface-card border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-micro font-bold ${
                      isReaction
                        ? 'bg-amber text-black'
                        : isDiagram
                        ? 'bg-purple text-black'
                        : 'bg-primary-container text-white'
                    }`}
                  >
                    {block.number}
                  </span>
                  <Badge
                    variant={isReaction ? 'amber' : isDiagram ? 'purple' : 'sapphire'}
                    size="sm"
                  >
                    {block.type}
                  </Badge>
                </div>
                <span className="font-mono text-caption-sm text-text-muted">
                  {block.durationFormatted}
                </span>
              </div>

              {/* Thumbnail with time range */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                <img
                  src={block.thumbnail}
                  alt={block.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-nano text-white">
                  {block.timeRange}
                </div>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold text-text-primary leading-snug">
                  {block.title}
                </h4>
                <p className="font-sans text-caption-sm text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                  {block.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
