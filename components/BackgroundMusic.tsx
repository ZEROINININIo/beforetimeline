
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Volume1, Activity, Music, Disc, AlertCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

interface BackgroundMusicProps {
    isSetupMode?: boolean;
    isPlaying: boolean;
    onToggle: () => void;
    volume: number;
    onVolumeChange: (val: number) => void;
    audioSources?: string[]; // Changed from audioSrc to support array fallback
    trackTitle?: string;
    trackComposer?: string;
    className?: string;
}

const FADE_OUT_DURATION = 1500; // ms to fade out old track
const FADE_IN_DURATION = 2000;  // ms to fade in new track
const TOGGLE_FADE_DURATION = 800; // ms for pause/play toggle

// Global singleton to persist audio across component unmounts
let globalAudio: HTMLAudioElement | null = null;

const getGlobalAudio = () => {
    if (!globalAudio) {
        globalAudio = new Audio();
        globalAudio.loop = true;
        globalAudio.preload = 'auto'; 
    }
    return globalAudio;
};

// Helper to unlock audio context on user interaction
export const unlockGlobalAudio = () => {
    const audio = getGlobalAudio();
    if (audio.paused) {
        // Try to play silence or empty promise to unlock the audio engine on mobile/browsers
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.pause(); 
            }).catch(e => {
                // Ignore AbortError which happens if we pause immediately
            });
        }
    }
};

// Helper to reliably get absolute URL for comparison
const getAbsoluteUrl = (url: string): string => {
    try {
        if (/^https?:\/\//i.test(url) || /^\/\//.test(url)) return url;
        if (typeof window !== 'undefined' && window.location) {
            return new URL(url, window.location.href).href;
        }
        return url;
    } catch (e) {
        return url;
    }
};

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ 
    isSetupMode = false,
    isPlaying,
    onToggle,
    volume,
    onVolumeChange,
    audioSources = [],
    trackTitle = "UNKNOWN",
    trackComposer = "UNKNOWN",
    className = ""
}) => {
  const fadeIntervalRef = useRef<number | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Manage fallback state
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  // Retry mechanism state (for reloading same source)
  const [retryTrigger, setRetryTrigger] = useState(0);
  
  // Controls the overall visibility of the panel (Play Button + Volume)
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Reset fallback index if the primary track changes
  useEffect(() => {
      setCurrentSourceIndex(0);
  }, [audioSources[0]]);

  // Auto-expand when play starts manually
  useEffect(() => {
      if (isPlaying && !isSetupMode) {
          setIsExpanded(true);
      }
  }, [isPlaying, isSetupMode]);

  // Initial Load Watchdog: Retry up to 3 times if stuck
  useEffect(() => {
      if (audioSources.length === 0 || !isPlaying || isSetupMode) return;

      const maxRetries = 3;
      let attempt = 0;
      let timer: number;

      const checkAndRetry = () => {
          const audio = getGlobalAudio();
          // Check if it should be playing but is paused, stuck, or not ready
          if (attempt < maxRetries && (audio.paused || audio.readyState < 3)) {
              attempt++;
              console.log(`[BGM] Audio appears stuck. Force reloading attempt ${attempt}/${maxRetries}`);
              setRetryTrigger(prev => prev + 1); // Trigger the source effect to reload
              timer = window.setTimeout(checkAndRetry, 2500); // Wait 2.5s before next check
          }
      };

      // Start the first check after 1.5s to give normal load a chance
      timer = window.setTimeout(checkAndRetry, 1500);

      return () => window.clearTimeout(timer);
  }, []); 

  // Advanced Volume Fader
  const performFade = (targetVol: number, duration: number): Promise<void> => {
      return new Promise((resolve) => {
          const audio = getGlobalAudio();
          if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);

          const startVol = audio.volume;
          const diff = targetVol - startVol;
          
          if (Math.abs(diff) < 0.01) {
              audio.volume = targetVol;
              resolve();
              return;
          }

          const startTime = Date.now();
          fadeIntervalRef.current = window.setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              audio.volume = Math.max(0, Math.min(1, startVol + (diff * progress)));

              if (progress >= 1) {
                  if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
                  audio.volume = targetVol;
                  resolve();
              }
          }, 50);
      });
  };

  // 1. Initialize Listeners and Fallback Logic
  useEffect(() => {
    const audio = getGlobalAudio();

    const handleCanPlay = () => {
        setIsLoading(false);
        setError(false);
    };

    const handleError = (e: Event) => {
        console.warn(`Audio Error on source index ${currentSourceIndex}:`, e);
        
        // Fallback Logic
        if (currentSourceIndex < audioSources.length - 1) {
            console.log(`[BGM] Switching to backup source...`);
            setCurrentSourceIndex(prev => prev + 1);
            // This state update will trigger the source switching effect below
            setError(false);
        } else {
            // No more sources to try
            setError(true);
            setIsLoading(false);
        }
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
        setIsLoading(false);
        setError(false);
    };
    
    if (audio.readyState >= 3) {
        setIsLoading(false);
    }

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleCanPlay); 
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadeddata', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
    };
  }, [audioSources, currentSourceIndex]); // Re-bind when sources list or index changes

  // 2. Handle Source Switching (Depends on active source from array)
  useEffect(() => {
    const audio = getGlobalAudio();
    const activeSrc = audioSources[currentSourceIndex] || "";
    
    const newAbsSrc = activeSrc ? getAbsoluteUrl(activeSrc) : "";
    const audioCurrentAbsSrc = audio.src; 

    // Optimization: If source matches AND it's not a forced retry (trigger > 0), skip reload
    if (newAbsSrc && audioCurrentAbsSrc === newAbsSrc && retryTrigger === 0) {
        currentSrcRef.current = activeSrc;
        // Resume logic
        if (isPlaying) {
            if (audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsLoading(false);
                            if (audio.volume < volume) performFade(volume, FADE_IN_DURATION);
                        })
                        .catch(e => {
                            console.warn("Resume blocked:", e);
                            setIsLoading(false);
                        });
                }
            } else {
                setIsLoading(false);
                if (audio.volume < volume) performFade(volume, FADE_IN_DURATION);
            }
        }
        return;
    }
    
    currentSrcRef.current = activeSrc;

    const switchTrack = async () => {
        setIsLoading(true);
        setError(false);

        if (!audio.paused && audio.volume > 0) {
            await performFade(0, FADE_OUT_DURATION);
            audio.pause();
        } else {
            audio.volume = 0;
        }

        if (newAbsSrc) {
            audio.src = newAbsSrc;
            audio.load();
            
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsLoading(false);
                            performFade(volume, FADE_IN_DURATION);
                        })
                        .catch(e => {
                            console.warn("Auto-play blocked or load error", e);
                            setIsLoading(false);
                        });
                }
            } else {
                setIsLoading(false);
            }
        } else {
            audio.removeAttribute('src');
            setIsLoading(false);
        }
    };

    switchTrack();

  }, [audioSources, currentSourceIndex, retryTrigger]);

  // 3. Handle Play/Pause Toggle
  useEffect(() => {
      const audio = getGlobalAudio();
      if (!audio.src) return;

      if (isPlaying) {
          if (audio.paused) {
              audio.volume = 0;
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                  playPromise
                    .then(() => {
                        setIsLoading(false);
                        performFade(volume, TOGGLE_FADE_DURATION);
                    })
                    .catch(e => {
                        console.warn("Toggle play failed", e);
                        setIsLoading(false);
                    });
              }
          } else {
              if (Math.abs(audio.volume - volume) > 0.1) {
                  performFade(volume, 500);
              }
          }
      } else {
          if (!audio.paused) {
              performFade(0, TOGGLE_FADE_DURATION).then(() => {
                  if (!isPlaying) audio.pause();
              });
          }
      }
  }, [isPlaying]);

  // 4. Handle Volume Slider Drag
  useEffect(() => {
      const audio = getGlobalAudio();
      if (isPlaying && !audio.paused && !isLoading) {
          performFade(volume, 200); 
      }
  }, [volume]);

  // 5. Handle Page Visibility (Auto Pause/Resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
        const audio = getGlobalAudio();
        
        if (document.hidden) {
            // Background: Fade out and pause if currently playing
            // We check !audio.paused to ensure we don't try to pause something already paused
            // We check isPlaying to ensure we only interrupt if it was *supposed* to be playing
            if (!audio.paused && isPlaying) {
                performFade(0, 500).then(() => {
                    audio.pause();
                });
            }
        } else {
            // Foreground: Resume if intent (isPlaying) is true
            if (isPlaying && audio.src) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Fade back in to the user-set volume
                            performFade(volume, 1000);
                        })
                        .catch(e => console.warn("Auto-resume failed", e));
                }
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, volume]); // Dependencies are critical here

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(parseFloat(e.target.value));
  };

  const isDisabled = audioSources.length === 0 || error;

  if (isSetupMode) {
    return (
       <div className={`flex flex-col gap-1 w-full ${className}`}>
           <button 
               onClick={onToggle}
               className={`w-full flex items-center justify-between p-3 border font-mono text-xs transition-colors ${
                   isPlaying 
                   ? 'border-amber-500 bg-amber-500/20 text-amber-400' 
                   : 'border-amber-800/50 text-amber-800 hover:border-amber-600 hover:text-amber-600'
               }`}
           >
               <span className="flex items-center gap-2"><Music size={14} /> AUDIO_SYSTEM</span>
               {isPlaying ? <Activity size={14} className="animate-pulse" /> : <span>OFF</span>}
           </button>
       </div>
    );
 }

  // Compact Mode UI
  return (
    <div className={`flex items-start justify-end gap-2 ${className}`}>
        
        {/* Collapsible Main Controls (Slides out to the left) */}
        <div className={`
            flex flex-col gap-1 transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}
        `}>
            {/* Main Play/Pause Button */}
            <button 
                onClick={onToggle}
                disabled={isDisabled && !isPlaying} 
                className={`flex items-center justify-between px-3 py-3 border-2 transition-all duration-300 shadow-hard group min-w-[160px]
                    ${isDisabled 
                        ? 'bg-ash-black text-ash-gray border-ash-gray/30 cursor-not-allowed opacity-70'
                        : isPlaying 
                            ? 'bg-ash-light text-ash-black border-ash-light' 
                            : 'bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light'
                    }`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                        {isLoading ? <Loader2 size={16} className="animate-spin text-ash-gray" /> :
                        error ? <AlertCircle size={16} className="text-red-500" /> : 
                        isPlaying && !isDisabled ? <Disc size={16} className="animate-spin" /> : <Volume2 size={16} />}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase truncate">
                        {isLoading ? 'BUFFER...' : isPlaying ? 'BGM ON' : 'BGM OFF'}
                    </span>
                </div>
                
                {isPlaying && !isDisabled && !error && (
                    <div className="flex gap-0.5 items-end h-3 ml-2 shrink-0">
                        <div className="w-0.5 bg-current animate-[bounce_1s_infinite] h-2"></div>
                        <div className="w-0.5 bg-current animate-[bounce_1.2s_infinite] h-3"></div>
                        <div className="w-0.5 bg-current animate-[bounce_0.8s_infinite] h-1"></div>
                    </div>
                )}
            </button>

            {/* Volume Panel (Always visible when expanded) */}
            {isPlaying && !isDisabled && (
                <div className="flex flex-col gap-2 px-3 py-2 border-l-2 border-ash-light bg-ash-dark/90 backdrop-blur-sm animate-fade-in shadow-hard-sm min-w-[160px]">
                    <div className="flex justify-between items-center text-[9px] font-mono text-ash-gray">
                        <span className="truncate max-w-[60%]">{trackTitle}</span>
                        <span className="opacity-50 truncate max-w-[35%] text-right">{trackComposer}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Volume1 size={10} className="text-ash-gray shrink-0" />
                        <div className="flex-1 min-w-0 flex items-center">
                            <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-ash-light [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ash-black hover:[&::-webkit-slider-thumb]:bg-ash-white transition-all rounded-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Master Collapse Toggle Button (Anchor on the right) */}
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isDisabled && !isPlaying}
            className={`
                h-[44px] w-[44px] flex items-center justify-center border-2 transition-all duration-300 shrink-0
                ${isExpanded 
                    ? 'border-ash-light bg-ash-black text-ash-light hover:bg-ash-light hover:text-ash-black' 
                    : 'bg-ash-black text-ash-light border-ash-gray/50 shadow-hard'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {isExpanded ? (
                <ChevronRight size={18} />
            ) : (
                <Music size={18} className={isPlaying && !isDisabled ? "animate-pulse text-green-400" : ""} />
            )}
        </button>
    </div>
  );
};

export default BackgroundMusic;
