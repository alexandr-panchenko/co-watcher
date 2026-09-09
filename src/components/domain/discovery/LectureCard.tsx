import React from 'react';
import { useTranslation } from 'react-i18next';
import { VideoLecture } from '../../../types';
import { Card, Badge, Button } from '../../ui';

interface LectureCardProps {
  lecture: VideoLecture;
  onSelect: (lecture: VideoLecture) => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, onSelect }) => {
  const { t: tCommon } = useTranslation('common');
  const isBest = lecture.badgeType === 'best-match';

  return (
    <Card
      variant="card"
      className={`p-3 transition-all flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between group ${
        isBest
          ? 'border-primary/40 shadow-md hover:border-primary'
          : 'hover:border-border-hover'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 flex-1">
        {/* Thumbnail with duration */}
        <div className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden shrink-0 bg-surface-canvas border border-border-default shadow-sm">
          <img
            alt={lecture.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={lecture.thumbnail}
          />
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-caption-sm font-mono text-white flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-xs text-primary">timer</span>
            <span>{lecture.duration}</span>
          </div>
        </div>

        {/* Info & Meta */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                lecture.badgeType === 'best-match'
                  ? 'sapphire'
                  : lecture.badgeType === 'technical'
                  ? 'emerald'
                  : lecture.badgeType === 'clashes'
                  ? 'amber'
                  : 'neutral'
              }
              size="sm"
            >
              {lecture.badgeLabel}
            </Badge>
            <span className="text-caption-sm font-mono text-text-muted">•</span>
            <span className="text-caption-sm font-mono text-text-secondary">{lecture.institution}</span>
            {lecture.speaker && (
              <>
                <span className="text-caption-sm font-mono text-text-muted">•</span>
                <span className="text-caption-sm text-text-muted truncate">{lecture.speaker}</span>
              </>
            )}
          </div>

          <h3 className="font-sans text-sm md:text-body-compact font-semibold text-text-primary tracking-tight leading-snug group-hover:text-primary transition-colors">
            {lecture.title}
          </h3>

          <p className="font-sans text-xs text-text-secondary leading-relaxed line-clamp-2">
            {lecture.description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full sm:w-auto flex justify-end shrink-0 pt-1 sm:pt-0">
        <Button
          variant={isBest ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(lecture)}
          icon={<span className="material-symbols-outlined text-base">play_arrow</span>}
        >
          {tCommon('actions.watchWithCoPilot')}
        </Button>
      </div>
    </Card>
  );
};
