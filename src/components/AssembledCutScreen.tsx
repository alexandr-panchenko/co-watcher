import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ASSEMBLED_CUT_BLOCKS } from '../data/mockData';
import { SequenceBlock, ScreenType } from '../types';
import { CutStagePreview } from './domain/assembly/CutStagePreview';
import { SequenceTimeline } from './domain/assembly/SequenceTimeline';
import { CutAssistantChat } from './domain/assembly/CutAssistantChat';
import { AssembledCutHeader } from './domain/assembly/AssembledCutHeader';
import { SegmentedControl, SegmentedControlOption } from './ui';

interface AssembledCutScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenExport: () => void;
}

export const AssembledCutScreen: React.FC<AssembledCutScreenProps> = ({
  onNavigate,
  onOpenExport,
}) => {
  const { t } = useTranslation('assembly');
  const [blocks, setBlocks] = useState<SequenceBlock[]>(ASSEMBLED_CUT_BLOCKS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(32); // 00:32
  const [totalLengthSec, setTotalLengthSec] = useState(78); // 01:18
  const [layoutMode, setLayoutMode] = useState<'pip' | 'split' | 'fullscreen-diagram'>('pip');
  const [duckingActive, setDuckingActive] = useState(true);
  const [animatedCaptions, setAnimatedCaptions] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('block-2');

  const [cutHistory, setCutHistory] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; details?: string }>
  >([
    {
      sender: 'user',
      text: 'Cut the first 5 seconds of the source lecture and bring in the projection diagram right as I mention matrices.',
    },
    {
      sender: 'ai',
      text: 'Updated! Trimmed source intro to 15s, and synced Block 3 diagram overlay to trigger at 00:24 during your second sentence.',
      details: 'Preview regenerated • Transitions re-rendered',
    },
  ]);
  const [refinePrompt, setRefinePrompt] = useState('');

  // Playback loop
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalLengthSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalLengthSec]);

  // Determine active block from time
  const activeBlock = blocks.find((b) => currentTimeSec >= b.startSec && currentTimeSec < b.endSec);
  const effectiveSelectedBlockId = selectedBlockId || activeBlock?.id || 'block-2';

  const handleApplyQuickRevision = (type: string) => {
    if (type === 'trim-3s') {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === 'block-1'
            ? { ...b, endSec: b.endSec - 3, timeRange: '0:00 – 0:17', durationFormatted: '0:17' }
            : b
        )
      );
      setCutHistory((prev) => [
        ...prev,
        { sender: 'user', text: 'Trim 3s off intro source' },
        {
          sender: 'ai',
          text: 'Trimmed 3s from Block 1. Source clip now starts at 0:00 and ends at 0:17.',
          details: 'Sequence rebuilt • Total runtime adjusted',
        },
      ]);
      setTotalLengthSec((p) => p - 3);
    } else if (type === 'mute-source') {
      setDuckingActive(false);
      setCutHistory((prev) => [
        ...prev,
        { sender: 'user', text: 'Mute source during reaction' },
        {
          sender: 'ai',
          text: 'Source audio is now completely muted (-∞ dB) during Block 2 user reaction voiceover.',
          details: 'Audio tracks re-mixed',
        },
      ]);
    } else if (type === 'diagram-fullscreen') {
      setLayoutMode((prev) => (prev === 'fullscreen-diagram' ? 'pip' : 'fullscreen-diagram'));
      setCutHistory((prev) => [
        ...prev,
        { sender: 'user', text: 'Toggle diagram full-screen layout' },
        {
          sender: 'ai',
          text: 'Projection matrix schematic switched to primary stage with reaction camera in lower corner.',
          details: 'Layout compositor updated',
        },
      ]);
    }
  };

  const handleRefineCut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim()) return;

    const userText = refinePrompt.trim();
    setRefinePrompt('');

    setCutHistory((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'ai', text: 'Re-rendering cut preview with requested adjustments...' },
    ]);

    setTimeout(() => {
      let reply = `Adjusted timing and transitions according to your prompt.`;
      const lower = userText.toLowerCase();

      if (lower.includes('trim') || lower.includes('shorten')) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === 'block-2'
              ? { ...b, endSec: b.endSec - 2, durationFormatted: '0:26' }
              : b
          )
        );
        reply = `Trimmed 2 seconds from Block 2 reaction take. Audio ducking waveform realigned.`;
      } else if (lower.includes('reaction') || lower.includes('cam')) {
        reply = `Boosted reaction audio presence and extended Block 2 user camera outro by 2.5 seconds.`;
      } else if (lower.includes('diagram') || lower.includes('matrix')) {
        reply = `Added high-contrast callout glow to the multi-head attention matrix diagram in Block 3.`;
      } else if (lower.includes('source') || lower.includes('range')) {
        reply = `Adjusted source playback range: extending introductory context clip by 4 seconds.`;
        setTotalLengthSec((p) => p + 4);
      }

      setCutHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          details: 'Waveform synced • Sequence updated',
        },
      ]);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full min-h-stage bg-surface-base">
      <AssembledCutHeader onNavigate={onNavigate} onOpenExport={onOpenExport} />

      {/* Main Cut Workbench Workspace */}
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Player Stage & Sequence Storyboard */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-surface-panel p-2 rounded-xl border border-white/5">
              <span className="text-xs font-mono text-text-muted">{t('modes.label')}</span>
              {(() => {
                const layoutOptions: SegmentedControlOption<'pip' | 'split' | 'fullscreen-diagram'>[] = [
                  { value: 'pip', label: t('modes.pip') },
                  { value: 'split', label: t('modes.split') },
                  { value: 'fullscreen-diagram', label: t('modes.diagram') },
                ];
                return (
                  <SegmentedControl<'pip' | 'split' | 'fullscreen-diagram'>
                    options={layoutOptions}
                    value={layoutMode}
                    onChange={(val) => setLayoutMode(val)}
                    size="sm"
                  />
                );
              })()}
            </div>

            <CutStagePreview
              layoutMode={layoutMode}
              isPlaying={isPlaying}
              currentTimeSec={currentTimeSec}
              totalLengthSec={totalLengthSec}
              duckingActive={duckingActive}
              animatedCaptions={animatedCaptions}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onSeek={setCurrentTimeSec}
              onToggleDucking={() => setDuckingActive(!duckingActive)}
              onToggleCaptions={() => setAnimatedCaptions(!animatedCaptions)}
            />

            <SequenceTimeline
              blocks={blocks}
              selectedBlockId={effectiveSelectedBlockId}
              onSelectBlock={(id, startSec) => {
                setSelectedBlockId(id);
                setCurrentTimeSec(startSec);
              }}
            />
          </div>

          {/* Right Column: AI Cut Assistant Chat */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-stage-min">
            <CutAssistantChat
              history={cutHistory}
              refinePrompt={refinePrompt}
              onChangeRefinePrompt={setRefinePrompt}
              onSubmit={handleRefineCut}
              onApplyQuickRevision={handleApplyQuickRevision}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
