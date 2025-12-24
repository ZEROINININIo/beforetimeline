
import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';

// Static imports for instant navigation (Fixes "Loading Module" slowness)
import HomePage from './pages/HomePage';
import CharactersPage from './pages/CharactersPage';
import DatabasePage from './pages/DatabasePage';
import ReaderPage from './pages/ReaderPage';
import SideStoriesPage from './pages/SideStoriesPage';

import BootSequence from './components/BootSequence';
import InitialSetup from './components/InitialSetup';
import CustomCursor from './components/CustomCursor';
import StoryEntryAnimation from './components/StoryEntryAnimation';
import { Language } from './types';
import { ReaderFont } from './components/fonts/fontConfig';
import { unlockGlobalAudio } from './components/BackgroundMusic';

// BGM Configuration - Remote Source Strategy with Fallbacks
// Defined outside component to ensure stable references for seamless playback
const AUDIO_MAP = {
  main: [
    "https://lz.qaiu.top/parser?url=https://sbcnm.lanzoum.com/i5OIw3dk1rte",
    "https://cik07-cos.7moor-fs2.com/im/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/fd991fcc1f737774/main.mp3"
  ],
  daily: [
    "https://lz.qaiu.top/parser?url=https://sbcnm.lanzoum.com/i5TeC3dk1q1a",
    "https://cik07-cos.7moor-fs2.com/im/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/6f611d085fec7cfe/daily.mp3"
  ],
  x: [
    "https://lz.qaiu.top/parser?url=https://sbcnm.lanzoum.com/iekyU3dk1sgh",
    "https://cik07-cos.7moor-fs2.com/im/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/c61f71beeec593f0/x.mp3"
  ],
  byaki: [
    "https://cik07-cos.7moor-fs2.com/im/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/e49d774395d5381a/Byaki..mp3",
    "https://lz.qaiu.top/parser?url=https://sbcnm.lanzoum.com/iCU593dnamda"
  ]
};

const STORAGE_KEY = 'nova_labs_config_v6';

interface AppConfig {
  language: Language;
  crtEnabled: boolean;
  isLightTheme: boolean;
  setupCompleted: boolean;
  bgmPlaying: boolean;
  bgmVolume: number;
  readerFont: ReaderFont;
}

const defaultConfig: AppConfig = {
  language: 'zh-CN',
  crtEnabled: true,
  isLightTheme: false,
  setupCompleted: false,
  bgmPlaying: true, 
  bgmVolume: 0.15,
  readerFont: 'custom-02'
};

const App: React.FC = () => {
  // 1. Load config from localStorage immediately to determine initial state
  const loadConfig = (): AppConfig => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Failed to load config", e);
    }
    return defaultConfig;
  };

  const initialConfig = loadConfig();

  // App State: 'BOOT' -> 'SETUP' -> 'READY'
  const [appState, setAppState] = useState<'BOOT' | 'SETUP' | 'READY'>('BOOT');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  
  // BGM Context State
  const [activeSideStoryVolumeId, setActiveSideStoryVolumeId] = useState<string | null>(null);
  
  // Transition State
  const [isEnteringStory, setIsEnteringStory] = useState(false);

  // Global Preference State (Initialized from storage)
  const [language, setLanguage] = useState<Language>(initialConfig.language);
  const [crtEnabled, setCrtEnabled] = useState(initialConfig.crtEnabled);
  const [isLightTheme, setIsLightTheme] = useState(initialConfig.isLightTheme);
  const [setupCompleted, setSetupCompleted] = useState(initialConfig.setupCompleted);
  const [readerFont, setReaderFont] = useState<ReaderFont>(initialConfig.readerFont);
  
  // BGM State (Lifted)
  const [bgmPlaying, setBgmPlaying] = useState(initialConfig.bgmPlaying);
  const [bgmVolume, setBgmVolume] = useState(initialConfig.bgmVolume);

  // Remove the static HTML loader when React App mounts
  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      // Small delay to ensure render is ready and transition looks smooth
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 500);
      }, 300);
    }
  }, []);

  // 2. Persist settings whenever they change
  useEffect(() => {
    const config: AppConfig = {
      language,
      crtEnabled,
      isLightTheme,
      setupCompleted,
      bgmPlaying,
      bgmVolume,
      readerFont
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [language, crtEnabled, isLightTheme, setupCompleted, bgmPlaying, bgmVolume, readerFont]);

  const handleBootComplete = () => {
    // Unlock audio context immediately after user interaction (Boot click)
    unlockGlobalAudio();

    if (setupCompleted) {
      setAppState('READY');
    } else {
      setAppState('SETUP');
    }
  };

  const handleSetupComplete = () => {
    setSetupCompleted(true);
    setAppState('READY');
  };

  // Logic to intercept navigation for animation triggers
  const handleNavigationChange = (tab: string) => {
      setActiveTab(tab);
      // Reset side story context when leaving tab
      if (tab !== 'sidestories') {
          setActiveSideStoryVolumeId(null);
      }
  };

  // Triggered from HomePage button
  const startStorySequence = () => {
    setIsEnteringStory(true);
  };

  // Called when MAIN story animation finishes
  const handleStoryEntryComplete = () => {
    setActiveTab('reader');
    setIsEnteringStory(false);
  };

  const handleHomeNavigate = (tab: string) => {
    if (tab === 'reader') {
        startStorySequence();
    } else {
        setActiveTab(tab);
    }
  };

  // --- Dynamic Audio Logic ---
  // Memoize to prevent playback interruption on re-renders unless track actually changes
  // Using stable AUDIO_MAP references ensures the array prop remains referentially equal
  const audioConfig = useMemo(() => {
    if (activeTab === 'sidestories') {
        // Only switch BGM if inside a specific volume
        if (activeSideStoryVolumeId === 'VOL_DAILY') {
            return { sources: AUDIO_MAP.daily, title: "TIMELINE DAILY", composer: "NOVA_OST" };
        }
        if (activeSideStoryVolumeId === 'VOL_MEMORIES') {
            return { sources: AUDIO_MAP.x, title: "神隠しの真相", composer: "しゃろう" };
        }
        if (activeSideStoryVolumeId === 'VOL_VARIABLE') {
            return { sources: AUDIO_MAP.byaki, title: "Byaki.", composer: "NOVA_OST" };
        }
        // If just in the menu (activeSideStoryVolumeId is null) or unknown volume, fall back to MAIN
        return { sources: AUDIO_MAP.main, title: "TIMELINE MAIN", composer: "NOVA_OST" };
    }
    // Default / Home / Reader
    return { sources: AUDIO_MAP.main, title: "TIMELINE MAIN", composer: "NOVA_OST" };
  }, [activeTab, activeSideStoryVolumeId]);

  return (
    <>
      {/* Global Cursor - Always rendered on top */}
      <CustomCursor />

      {/* Render Boot Sequence */}
      {appState === 'BOOT' && (
        <BootSequence 
          onComplete={handleBootComplete} 
          isNormalBoot={setupCompleted} 
          language={language}
        />
      )}

      {/* Render Initial Setup */}
      {appState === 'SETUP' && (
        <InitialSetup 
            onComplete={handleSetupComplete}
            language={language}
            setLanguage={setLanguage}
            crtEnabled={crtEnabled}
            setCrtEnabled={setCrtEnabled}
            isLightTheme={isLightTheme}
            setIsLightTheme={setIsLightTheme}
            bgmPlaying={bgmPlaying}
            setBgmPlaying={setBgmPlaying}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
        />
      )}

      {/* Main Story Transition Animation */}
      {isEnteringStory && (
        <StoryEntryAnimation 
            onComplete={handleStoryEntryComplete}
            language={language}
        />
      )}

      {/* Render Main App */}
      {appState === 'READY' && (
        <div className="flex flex-col lg:flex-row h-screen supports-[height:100dvh]:h-[100dvh] bg-ash-black text-ash-light overflow-hidden font-mono selection:bg-ash-light selection:text-ash-black cursor-none">
          
          {/* Global Texture Overlays */}
          <div className="noise-overlay"></div>
          
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 bg-grid-hard pointer-events-none opacity-50"></div>

          {/* Main Layout */}
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={handleNavigationChange} 
            language={language}
            setLanguage={setLanguage}
            crtEnabled={crtEnabled}
            setCrtEnabled={setCrtEnabled}
            isLightTheme={isLightTheme}
            setIsLightTheme={setIsLightTheme}
            bgmPlaying={bgmPlaying}
            setBgmPlaying={setBgmPlaying}
            bgmVolume={bgmVolume}
            setBgmVolume={setBgmVolume}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
            // Audio Props
            audioSources={audioConfig.sources}
            trackTitle={audioConfig.title}
            trackComposer={audioConfig.composer}
          />
          
          <main className="flex-1 h-full overflow-hidden relative z-10 border-l-2 border-ash-dark">
            {/* Suspense removed to prevent "Loading Module" flicker. Pages are now statically imported. */}
            <div 
              key={activeTab}
              className="h-full overflow-y-auto pb-20 lg:pb-0 bg-ash-black/90 animate-slide-in"
            >
              {activeTab === 'home' && (
                <HomePage 
                  onNavigate={handleHomeNavigate}
                  language={language}
                  setLanguage={setLanguage}
                />
              )}
              {activeTab === 'characters' && <CharactersPage language={language} />}
              {activeTab === 'database' && <DatabasePage language={language} />}
              {activeTab === 'reader' && (
                <ReaderPage 
                  currentIndex={currentChapterIndex} 
                  onChapterChange={setCurrentChapterIndex} 
                  language={language}
                  isLightTheme={isLightTheme}
                  readerFont={readerFont}
                />
              )}
              {activeTab === 'sidestories' && (
                <SideStoriesPage 
                  language={language} 
                  isLightTheme={isLightTheme}
                  onVolumeChange={setActiveSideStoryVolumeId}
                  readerFont={readerFont}
                />
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default App;
