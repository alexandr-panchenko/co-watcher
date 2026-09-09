import { useState } from 'react';
import { ScreenType, VideoLecture } from './types';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { SessionScreen } from './components/SessionScreen';
import { AssembledCutScreen } from './components/AssembledCutScreen';
import { FactCheckModal } from './components/FactCheckModal';
import { ExportModal } from './components/ExportModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedLecture, setSelectedLecture] = useState<VideoLecture | null>(null);
  const [hasReaction, setHasReaction] = useState<boolean>(false);

  // Modals state
  const [factCheckOpen, setFactCheckOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleSelectLecture = (lecture: VideoLecture) => {
    setSelectedLecture(lecture);
    setCurrentScreen('session');
  };

  const handleNavigate = (screen: ScreenType) => {
    if ((screen === 'session' || screen === 'assembly') && !selectedLecture) {
      setCurrentScreen('discovery');
      return;
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-surface-base text-text-primary flex flex-col font-sans antialiased">
      {/* Persistent Global Header */}
      <Header
        onNavigate={handleNavigate}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* Main Content View with top offset for sticky header */}
      <main className="flex-1 pt-14 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectLecture={handleSelectLecture}
          />
        )}

        {currentScreen === 'discovery' && (
          <DiscoveryScreen
            onSelectLecture={handleSelectLecture}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'session' && (
          selectedLecture ? (
            <SessionScreen
              onNavigate={handleNavigate}
              onOpenFactCheck={() => setFactCheckOpen(true)}
              hasReaction={hasReaction}
              setHasReaction={setHasReaction}
              lecture={selectedLecture}
            />
          ) : (
            <DiscoveryScreen
              onSelectLecture={handleSelectLecture}
              onNavigate={handleNavigate}
            />
          )
        )}

        {currentScreen === 'assembly' && (
          selectedLecture ? (
            <AssembledCutScreen
              onNavigate={handleNavigate}
              onOpenExport={() => setExportOpen(true)}
            />
          ) : (
            <DiscoveryScreen
              onSelectLecture={handleSelectLecture}
              onNavigate={handleNavigate}
            />
          )
        )}
      </main>

      {/* Global Modals */}
      <FactCheckModal
        isOpen={factCheckOpen}
        onClose={() => setFactCheckOpen(false)}
      />

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
}
