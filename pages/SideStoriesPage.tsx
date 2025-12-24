
import React, { useState } from 'react';
import { sideStoryVolumes } from '../data/sideStories';
import { Language, SideStoryVolume } from '../types';
import SideStoryVolumeList from '../components/sidestory/SideStoryVolumeList';
import SideStoryChapterList from '../components/sidestory/SideStoryChapterList';
import SideStoryExtraDirectory from '../components/sidestory/SideStoryExtraDirectory';
import SideStoryReader from '../components/sidestory/SideStoryReader';
import SideCharacterModal from '../components/sidestory/SideCharacterModal';
import SideStoryEntryAnimation from '../components/SideStoryEntryAnimation';
import { ReaderFont } from '../components/fonts/fontConfig';
import TemporaryTerminal from '../components/TemporaryTerminal';

interface SideStoriesPageProps {
  language: Language;
  isLightTheme: boolean;
  onVolumeChange: (volumeId: string | null) => void;
  readerFont: ReaderFont;
}

const SideStoriesPage: React.FC<SideStoriesPageProps> = ({ language, isLightTheme, onVolumeChange, readerFont }) => {
  // Navigation State: 'volumes' -> 'chapters' -> 'extra_directory' (optional) -> 'reader'
  const [viewMode, setViewMode] = useState<'volumes' | 'chapters' | 'extra_directory' | 'reader'>('volumes');
  const [activeVolume, setActiveVolume] = useState<SideStoryVolume | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showCharModal, setShowCharModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  // Trigger animation when entering a folder (Volume)
  const handleVolumeSelect = (vol: SideStoryVolume) => {
    setActiveVolume(vol);
    onVolumeChange(vol.id); // Notify App.tsx to potentially play music
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    setViewMode('chapters');
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    setViewMode('reader');
  };

  const handleEnterExtraDirectory = () => {
    setViewMode('extra_directory');
  };

  const handleExtraChapterSelect = (chapterId: string) => {
      if (!activeVolume) return;
      const index = activeVolume.chapters.findIndex(c => c.id === chapterId);
      if (index !== -1) {
          setCurrentChapterIndex(index);
          setViewMode('reader');
      }
  };
  
  const handleBackToVolumes = () => {
      setActiveVolume(null);
      onVolumeChange(null); // Notify App.tsx we left the volume
      setViewMode('volumes');
  };

  // Render Animation if active
  if (isAnimating && activeVolume) {
    return (
        <SideStoryEntryAnimation 
            onComplete={handleAnimationComplete}
            language={language}
            volumeId={activeVolume.id}
        />
    );
  }

  // --- View 1: Volume Index (Directory) ---
  if (viewMode === 'volumes') {
    return (
        <>
            <SideStoryVolumeList 
                volumes={sideStoryVolumes}
                onSelectVolume={handleVolumeSelect}
                onOpenCharModal={() => setShowCharModal(true)}
                onOpenTerminal={() => setShowTerminal(true)}
                language={language}
                isLightTheme={isLightTheme}
            />
            <SideCharacterModal 
                isOpen={showCharModal}
                onClose={() => setShowCharModal(false)}
                language={language}
                isLightTheme={isLightTheme}
            />
            {showTerminal && (
                <TemporaryTerminal 
                    language={language}
                    onClose={() => setShowTerminal(false)}
                />
            )}
        </>
    );
  }

  // --- View 2: Chapter List (File Browser) ---
  if (viewMode === 'chapters' && activeVolume) {
      return (
        <SideStoryChapterList 
            volume={activeVolume}
            onBack={handleBackToVolumes}
            onSelectChapter={handleChapterSelect}
            // NEW: Specialized logic for Byaki's extras
            onEnterExtra={handleEnterExtraDirectory}
            language={language}
            isLightTheme={isLightTheme}
        />
      );
  }

  // --- View 2.5: Extra Fragmented Directory ---
  if (viewMode === 'extra_directory' && activeVolume) {
      const extraChapters = activeVolume.chapters.filter(c => c.id === 'story-byaki-diary');
      return (
          <SideStoryExtraDirectory 
            chapters={extraChapters}
            onBack={() => setViewMode('chapters')}
            onSelectChapter={handleExtraChapterSelect}
            language={language}
            isLightTheme={isLightTheme}
          />
      );
  }

  // --- View 3: Reader ---
  if (viewMode === 'reader' && activeVolume) {
      return (
        <SideStoryReader 
            volume={activeVolume}
            initialChapterIndex={currentChapterIndex}
            onBack={() => {
                // If it was an extra chapter, return to extra directory, else return to chapters
                const isExtra = activeVolume.chapters[currentChapterIndex].id === 'story-byaki-diary';
                setViewMode(isExtra ? 'extra_directory' : 'chapters');
            }}
            language={language}
            isLightTheme={isLightTheme}
            readerFont={readerFont}
        />
      );
  }

  return null;
};

export default SideStoriesPage;
