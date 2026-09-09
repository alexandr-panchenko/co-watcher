import { TimelineAnchor, VideoLecture, SequenceBlock } from '../types';

export interface RoomState {
  id: string;
  videoUrl: string;
  videoTitle?: string;
  videoId?: string;
  userPurpose?: string;
  comments: TimelineAnchor[];
  sequenceBlocks: SequenceBlock[];
  recommendations: VideoLecture[];
  createdAt: number;
  updatedAt: number;
}

export interface ParallelSearchResult {
  search_id: string;
  results: Array<{
    url: string;
    title: string;
    publish_date?: string;
    excerpts: string[];
  }>;
}

export interface VideoKeyMoment {
  startSec: number;
  timeFormatted: string;
  title: string;
  summary: string;
  category: TimelineAnchor['category'];
  categoryLabel: string;
  researchQuery?: string;
}
