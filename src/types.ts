export type ScreenType = 'home' | 'discovery' | 'session' | 'assembly';

export type ViewMode = 'standard' | 'theater' | 'mobile';

export type AnchorCategory =
  | 'fact-check'
  | 'analysis'
  | 'source'
  | 'reaction'
  | 'architecture'
  | 'foundations'
  | 'whiteboard'
  | 'benchmarks';

export interface TimelineAnchor {
  id: string;
  timeSec: number;
  timeFormatted: string;
  title: string;
  category: AnchorCategory;
  categoryLabel: string;
  summary: string;
  detail?: string;
  sources?: string;
  impact?: string;
  thumbnail?: string;
  imageUrl?: string;
  isReaction?: boolean;
  reactionDuration?: string;
  reactionAudioLevel?: number;
  mediaBlobUrl?: string;
  transcriptExcerpt?: string;
  isCluster?: boolean;
  clusterCount?: number;
  clusterItems?: Array<{
    id: string;
    title: string;
    category: AnchorCategory;
    categoryLabel: string;
    description: string;
  }>;
}

export interface VideoLecture {
  id: string;
  title: string;
  institution: string;
  speaker?: string | undefined;
  duration: string;
  durationSec: number;
  badgeType: 'best-match' | 'technical' | 'clashes' | 'quick';
  badgeLabel: string;
  badgeCategory: string;
  description: string;
  thumbnail: string;
  youtubeUrl?: string | undefined;
  videoId?: string | undefined;
}

export interface SequenceBlock {
  id: string;
  number: number;
  title: string;
  type: 'SOURCE VIDEO' | 'HUMAN VOICE & CAM' | 'AI CONTEXT OVERLAY';
  timeRange: string;
  startSec: number;
  endSec: number;
  durationFormatted: string;
  description: string;
  thumbnail: string;
  isActive?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  actionPills?: string[];
}
