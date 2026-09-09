import { useState } from 'react';
import { TimelineAnchor } from '../../../types';

interface UseSessionCompanionDockParams {
  anchors: TimelineAnchor[];
  currentTimeSec: number;
  selectedAnchorId: string | null;
  seekTo: (seconds: number) => void;
  setSelectedAnchorId: (id: string | null) => void;
  onNavigate: (screen: 'assembly') => void;
}

const TAG_LIST = ['All', 'Fact-Check', 'Analysis', 'Source', 'Reactions'];

export function useSessionCompanionDock({
  anchors,
  currentTimeSec,
  selectedAnchorId,
  seekTo,
  setSelectedAnchorId,
  onNavigate,
}: UseSessionCompanionDockParams) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [autoScroll, setAutoScroll] = useState(true);

  const activeAnchor =
    (autoScroll
      ? anchors.find((a) => Math.abs(a.timeSec - currentTimeSec) <= 8)
      : null) ??
    anchors.find((a) => a.id === selectedAnchorId) ??
    anchors[3] ??
    anchors[0];

  const currentActiveId = activeAnchor?.id ?? 'anchor-4';

  const filteredAnchors =
    selectedTag === 'All'
      ? anchors
      : anchors.filter((a) =>
          selectedTag === 'Reactions'
            ? a.isReaction
            : a.category.toLowerCase() === selectedTag.toLowerCase()
        );

  const handleSelectAnchor = (anchor: TimelineAnchor) => {
    seekTo(anchor.timeSec);
    setSelectedAnchorId(anchor.id);
  };

  const handleToggleTag = () => {
    const nextIndex = (TAG_LIST.indexOf(selectedTag) + 1) % TAG_LIST.length;
    const nextTag = TAG_LIST[nextIndex] ?? 'All';
    setSelectedTag(nextTag);
  };

  const handleToggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
  };

  const handleNavigateToAssembly = () => {
    onNavigate('assembly');
  };

  return {
    selectedTag,
    autoScroll,
    currentActiveId,
    filteredAnchors,
    handleSelectAnchor,
    handleToggleTag,
    handleToggleAutoScroll,
    handleNavigateToAssembly,
  };
}
