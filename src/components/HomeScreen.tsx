import React, { useState } from 'react';
import { ScreenType, VideoLecture } from '../types';
import { HomeHero } from './domain/home/HomeHero';
import { FeatureGrid } from './domain/home/FeatureGrid';
import { PromptSuggestions } from './domain/home/PromptSuggestions';
import { HomeChatBar } from './domain/home/HomeChatBar';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectLecture?: ((lecture: VideoLecture) => void) | undefined;
  onSearchQuery?: ((query: string) => void) | undefined;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onSelectLecture, onSearchQuery }) => {
  const [inputText, setInputText] = useState('');

  const promptSuggestions = [
    {
      text: '“Find me a good lecture about the history of artificial intelligence. I know modern LLMs, but not much about the people and older ideas.”',
      target: 'discovery' as ScreenType,
    },
    {
      text: '“Watch this interview with me and fact-check concrete claims, but don’t interrupt for opinions.”',
      target: 'discovery' as ScreenType,
    },
    {
      text: '“Find a technical introduction to reinforcement learning under one hour.”',
      target: 'discovery' as ScreenType,
    },
    {
      text: '“I’m learning English. Comment only on unusual expressions, cultural references, and things I’m unlikely to understand from context.”',
      target: 'discovery' as ScreenType,
    },
    {
      text: '“Help me turn the most interesting moments and my reactions into a short video.”',
      target: 'discovery' as ScreenType,
    },
  ];

  const handleYouTubeSubmit = (url: string) => {
    if (!onSelectLecture) return;
    let extractedId = 'bCz4OMemCcA';
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      extractedId = match[1];
    }
    const customLecture: VideoLecture = {
      id: extractedId,
      title: 'YouTube Stream • Video Session',
      institution: 'YouTube Video',
      duration: 'Live / VOD',
      durationSec: 1800,
      badgeType: 'best-match',
      badgeLabel: '★ Active Video',
      badgeCategory: 'Custom Stream',
      description: `Active video stream loaded from URL: ${url}`,
      thumbnail: '',
    };
    onSelectLecture(customLecture);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const isYouTube = lower.includes('youtube.com/') || lower.includes('youtu.be/');

    if (isYouTube && onSelectLecture) {
      handleYouTubeSubmit(trimmed);
      return;
    }

    if (lower.includes('reaction') || lower.includes('short video') || lower.includes('cut')) {
      onNavigate('assembly');
      return;
    }

    onSearchQuery?.(trimmed);
    onNavigate('discovery');
  };

  return (
    <div className="flex flex-col w-full min-h-stage bg-surface-base">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-12 flex flex-col items-center">
        <HomeHero />
        <FeatureGrid onNavigate={onNavigate} />
        <PromptSuggestions
          suggestions={promptSuggestions}
          onSelect={(item) => {
            const clean = item.text.replace(/^[“"]|[”"]$/g, '');
            setInputText(clean);
            onSearchQuery?.(clean);
            onNavigate(item.target);
          }}
        />
        <HomeChatBar
          inputText={inputText}
          onChangeInput={setInputText}
          onSubmit={handleSubmit}
          onAttachClick={() => onNavigate('discovery')}
        />
      </div>
    </div>
  );
};
