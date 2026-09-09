import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimelineAnchor, ViewMode } from '../../types';
import { Button, IconButton, SegmentedControl } from '../ui';

interface GemRailProps {
  anchors: TimelineAnchor[];
  currentTimeSec: number;
  totalDurationSec: number;
  viewMode: ViewMode;
  videoTitle?: string | undefined;
  institution?: string | undefined;
  onSeek: (timeSec: number) => void;
  onSelectAnchor: (anchorId: string) => void;
  onStartRecording: () => void;
  onChangeViewMode: (mode: ViewMode) => void;
}

interface ClusterGroup {
  id: string;
  timeSec: number;
  leftPercent: number;
  anchors: TimelineAnchor[];
}

export const GemRail: React.FC<GemRailProps> = ({
  anchors,
  currentTimeSec: _currentTimeSec,
  totalDurationSec,
  viewMode,
  videoTitle,
  institution,
  onSeek,
  onSelectAnchor,
  onStartRecording,
  onChangeViewMode,
}) => {
  const { t } = useTranslation('session');
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  // Group nearby anchors (< 4% of total timeline duration apart) into space-aware clusters
  const clusters = useMemo(() => {
    const validDuration = totalDurationSec > 0 ? totalDurationSec : 2294;
    const sorted = [...anchors].sort((a, b) => a.timeSec - b.timeSec);
    const groups: ClusterGroup[] = [];

    for (const anchor of sorted) {
      const leftPercent = (anchor.timeSec / validDuration) * 100;
      const lastGroup = groups[groups.length - 1];

      // If within 4% distance, group into cluster
      if (lastGroup && Math.abs(lastGroup.leftPercent - leftPercent) < 4.0) {
        lastGroup.anchors.push(anchor);
      } else {
        groups.push({
          id: `cluster-${anchor.id}`,
          timeSec: anchor.timeSec,
          leftPercent,
          anchors: [anchor],
        });
      }
    }

    return groups;
  }, [anchors, totalDurationSec]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reaction':
        return 'bg-amber shadow-glow-pin-amber';
      case 'fact-check':
        return 'bg-secondary shadow-gem-emerald';
      case 'foundations':
      case 'architecture':
        return 'bg-primary shadow-gem-sapphire';
      default:
        return 'bg-tertiary shadow-gem-tertiary';
    }
  };

  return (
    <div className="w-full bg-surface-canvas rounded-xl shadow-md border border-white/5 relative">
      {/* Header Info Bar */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-sans text-base md:text-lg font-semibold text-text-primary tracking-tight truncate">
            {videoTitle || t('header.title')}
          </h1>
          <div className="flex items-center gap-2 text-text-muted font-mono text-xs mt-0.5 flex-wrap">
            <span>{institution || t('header.institution')}</span>
            <span>•</span>
            <span>{t('header.duration')}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 bg-surface-card rounded text-micro text-primary">
              {t('header.quality')}
            </span>
          </div>
        </div>

        {/* Controls & Record Reaction Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={onStartRecording}
            icon={<span className="material-symbols-outlined text-base">videocam</span>}
          >
            {t('header.recordReaction')}
          </Button>

          <SegmentedControl
            options={[
              { value: 'standard', label: t('header.standard'), icon: 'splitscreen' },
              { value: 'theater', label: t('header.theater'), icon: 'desktop_windows' },
            ]}
            value={viewMode}
            onChange={(val) => onChangeViewMode(val as ViewMode)}
            size="sm"
          />
        </div>
      </div>

      {/* Gemstone Scrubber Rail */}
      <div className="px-4 pb-4 relative">
        <div className="relative w-full h-8 flex items-center bg-surface-panel rounded-lg px-3">
          <div className="w-full h-0.5 bg-surface-overlay rounded-full relative">
            {clusters.map((group) => {
              const isCluster = group.anchors.length > 1;
              const hasReaction = group.anchors.some((a) => a.isReaction);
              const firstAnchor = group.anchors[0];
              if (!firstAnchor) return null;

              if (isCluster) {
                const isOpen = activeClusterId === group.id;
                return (
                  <div
                    key={group.id}
                    role="button"
                    tabIndex={0}
                    aria-label={t('cluster.badge')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(group.timeSec);
                      onSelectAnchor(firstAnchor.id);
                      setActiveClusterId(isOpen ? null : group.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        onSeek(group.timeSec);
                        onSelectAnchor(firstAnchor.id);
                        setActiveClusterId(isOpen ? null : group.id);
                      }
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-20 group"
                    style={{ left: `${group.leftPercent}%` }}
                  >
                    <div
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border transition-transform ${
                        hasReaction
                          ? 'bg-amber-container/20 border-amber shadow-glow-pin-amber group-hover:scale-110'
                          : 'bg-primary-container/20 border-primary shadow-glow-pin-sapphire group-hover:scale-110'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <div className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span
                        className={`font-mono text-nano font-bold ml-0.5 ${
                          hasReaction ? 'text-amber' : 'text-primary'
                        }`}
                      >
                        {group.anchors.length}
                      </span>
                    </div>

                    {/* Space-aware Popover Tooltip */}
                    {isOpen && (
                      <div
                        role="dialog"
                        aria-label={t('cluster.badge')}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 bg-surface-overlay/95 text-text-primary rounded-xl p-2.5 shadow-2xl z-50 flex flex-col gap-1.5 border border-border-default backdrop-blur-md select-none text-left animate-fade-in"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-border-default">
                          <span className="font-mono text-micro text-text-muted">
                            {firstAnchor.timeFormatted} • {t('cluster.label', { count: group.anchors.length })}
                          </span>
                          <IconButton
                            iconName="close"
                            size="sm"
                            onClick={() => setActiveClusterId(null)}
                            title={t('cluster.closeTitle')}
                            className="p-0 text-text-muted hover:text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                          {group.anchors.map((a) => (
                            <div
                              key={a.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                onSeek(a.timeSec);
                                onSelectAnchor(a.id);
                                setActiveClusterId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  onSeek(a.timeSec);
                                  onSelectAnchor(a.id);
                                  setActiveClusterId(null);
                                }
                              }}
                              className="p-1.5 rounded bg-surface-card hover:bg-surface-hover cursor-pointer border border-white/5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-sans text-caption-sm text-text-primary truncate">
                                  {a.title}
                                </span>
                                <span className="font-mono text-nano text-text-muted">
                                  {a.categoryLabel}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Single Gem Marker
              const colorClass = getCategoryColor(firstAnchor.category);
              return (
                <div
                  key={firstAnchor.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${firstAnchor.timeFormatted} ${firstAnchor.title}`}
                  onClick={() => {
                    onSeek(firstAnchor.timeSec);
                    onSelectAnchor(firstAnchor.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSeek(firstAnchor.timeSec);
                      onSelectAnchor(firstAnchor.id);
                    }
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10 group"
                  style={{ left: `${group.leftPercent}%` }}
                  title={`${firstAnchor.timeFormatted} ${firstAnchor.title}`}
                >
                  <div
                    className={`w-2.5 h-2.5 ${colorClass} rotate-45 rounded-xs group-hover:scale-125 transition-transform`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
