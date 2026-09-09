import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DISCOVERY_LECTURES } from '../data/mockData';
import { VideoLecture, ScreenType } from '../types';
import { LectureCard } from './domain/discovery/LectureCard';
import { Input, Button, Card, IconButton } from './ui';

interface DiscoveryScreenProps {
  onSelectLecture: (lecture: VideoLecture) => void;
  onNavigate: (screen: ScreenType) => void;
  initialQuery?: string | undefined;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  onSelectLecture,
  onNavigate,
  initialQuery,
}) => {
  const { t } = useTranslation('discovery');
  const { t: tCommon } = useTranslation('common');

  const [refineInput, setRefineInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [lectures, setLectures] = useState<VideoLecture[]>(DISCOVERY_LECTURES);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>(
    initialQuery || t('userBubble.text')
  );

  const refinementPills = [
    '“Something shorter”',
    '“More technical with proofs”',
    '“Focus on the 1980s connectionist winter”',
    '“Prefer university lectures only”',
  ];

  const fetchRecommendations = React.useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setCurrentTopic(searchQuery);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (res.ok) {
        const data = (await res.json()) as { lectures?: VideoLecture[] };
        if (data.lectures && data.lectures.length > 0) {
          setLectures(data.lectures);
          setActiveFilter(null);
        }
      }
    } catch (e) {
      console.warn('Failed to load dynamic recommendations:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const timer = setTimeout(() => {
        void fetchRecommendations(initialQuery.trim());
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [initialQuery, fetchRecommendations]);

  const filteredLectures = activeFilter
    ? lectures.filter(
        (lec) =>
          lec.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
          lec.description.toLowerCase().includes(activeFilter.toLowerCase()) ||
          lec.institution.toLowerCase().includes(activeFilter.toLowerCase())
      )
    : lectures;

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = refineInput.trim();
    if (!query) return;

    if (query.length > 15 || query.includes(' ') || query.includes('find') || query.includes('lecture')) {
      void fetchRecommendations(query);
    } else {
      setActiveFilter(query);
    }
    setRefineInput('');
  };

  return (
    <div className="flex flex-col w-full min-h-stage justify-between bg-surface-base">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-6 flex-1">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-text-muted hover:text-text-primary font-mono text-xs"
            icon={<span className="material-symbols-outlined text-base">arrow_back</span>}
          >
            {tCommon('actions.backToVideo')}
          </Button>
        </div>

        {/* User Message Bubble */}
        <div className="flex items-start gap-3 self-end max-w-2xl">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-text-secondary font-mono text-caption-sm">
              <span>{t('userBubble.author')}</span>
              <span>•</span>
              <span>{t('userBubble.time')}</span>
            </div>
            <div className="bg-surface-hover text-text-primary p-3 rounded-xl rounded-tr-sm shadow-md font-sans text-body-compact leading-relaxed border border-border-default">
              {currentTopic}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-overlay flex items-center justify-center text-text-secondary font-mono text-micro font-semibold shrink-0 border border-border-default shadow-sm">
            YOU
          </div>
        </div>

        {/* AI Assistant Message Bubble with Lecture Cards */}
        <div className="flex items-start gap-3 self-start max-w-3xl w-full">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-mono text-micro shrink-0 shadow-md">
            <span className="material-symbols-outlined text-lg">psychology</span>
          </div>
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2 text-text-secondary font-mono text-caption-sm">
              <span className="text-primary font-semibold">{t('aiBubble.author')}</span>
              <span className="px-1.5 py-0.5 bg-primary-container/20 text-primary rounded font-mono text-nano uppercase font-bold">
                {t('aiBubble.role')}
              </span>
              <span>•</span>
              <span>{t('aiBubble.time')}</span>
            </div>

            <Card
              variant="panel"
              className="p-4 rounded-tl-sm flex flex-col gap-4 text-text-primary"
            >
              <p className="font-sans text-body-compact text-text-primary leading-relaxed">
                {isLoading
                  ? t('input.loadingCurating')
                  : t('aiBubble.text')}
              </p>

              {/* Lecture Cards List */}
              <div className="flex flex-col gap-3 w-full">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-text-muted">
                    <span className="material-symbols-outlined text-3xl text-primary animate-spin">
                      progress_activity
                    </span>
                    <span className="font-mono text-xs">{t('input.loadingCurating')}</span>
                  </div>
                ) : (
                  filteredLectures.map((lecture) => (
                    <LectureCard
                      key={lecture.id}
                      lecture={lecture}
                      onSelect={onSelectLecture}
                    />
                  ))
                )}
              </div>

              {/* AI Follow-up prompt & Suggestions */}
              <div className="pt-2 border-t border-border-default flex flex-col gap-2">
                <span className="text-xs text-text-secondary font-medium">
                  {t('aiBubble.refineTitle')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {refinementPills.map((pill, idx) => (
                    <Button
                      key={idx}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const clean = pill.replace(/^[“"]|[”"]$/g, '');
                        void fetchRecommendations(`${currentTopic} (${clean})`);
                      }}
                      className="px-3 py-1 rounded-full text-caption-sm font-mono text-text-secondary hover:text-text-primary"
                    >
                      {pill}
                    </Button>
                  ))}
                  {activeFilter && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setActiveFilter(null)}
                      className="px-2.5 py-1 rounded-full text-caption-sm font-mono"
                    >
                      {tCommon('actions.clearFilter', { filter: activeFilter })}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom conversational input */}
      <div className="w-full bg-surface-base/95 backdrop-blur-md border-t border-white/5 py-4 px-4 md:px-6 sticky bottom-0 z-10">
        <form onSubmit={handleRefineSubmit} className="max-w-3xl mx-auto flex flex-col gap-2">
          <Input
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            placeholder={t('input.placeholder')}
            startIcon={<span className="material-symbols-outlined text-lg">tune</span>}
            endIcon={
              <IconButton
                iconName="arrow_upward"
                type="submit"
                variant="filled"
                size="sm"
                title={t('input.sendTitle')}
                className="w-7 h-7 rounded-full"
              />
            }
          />
          <div className="flex items-center justify-between text-caption-sm font-mono text-text-muted px-1">
            <span>{t('input.footerStatus')}</span>
            <span>{isLoading ? 'Searching...' : `${filteredLectures.length} results available`}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
