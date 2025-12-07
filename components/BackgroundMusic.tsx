import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Activity, Check } from 'lucide-react';

interface BackgroundMusicProps {
    isSetupMode?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isSetupMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleMusic = () => {
    if (!audioCtxRef.current) {
      // Initialize Audio Context on first user gesture
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.05, ctx.currentTime); // Low volume
      masterGain.connect(ctx.destination);

      // --- Layer 1: Low Drone (Engine Hum) ---
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(50, ctx.currentTime);
      
      const lfo1 = ctx.createOscillator();
      lfo1.type = 'sine';
      lfo1.frequency.setValueAtTime(0.2, ctx.currentTime); // Slow modulation
      const lfoGain1 = ctx.createGain();
      lfoGain1.gain.setValueAtTime(2, ctx.currentTime);
      lfo1.connect(lfoGain1);
      lfoGain1.connect(osc1.frequency);

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(200, ctx.currentTime);

      osc1.connect(filter1);
      filter1.connect(masterGain);

      // --- Layer 2: Atmospheric Harmony ---
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(75, ctx.currentTime); // 5th above
      
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(150, ctx.currentTime);
      
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc2.connect(filter2);
      filter2.connect(osc2Gain);
      osc2Gain.connect(masterGain);

      // Start all
      osc1.start();
      lfo1.start();
      osc2.start();

      setIsPlaying(true);
    } else {
      // Toggle play/pause
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        setIsPlaying(true);
      } else {
        audioCtxRef.current.suspend();
        setIsPlaying(false);
      }
    }
  };

  if (isSetupMode) {
    return (
       <button 
           onClick={toggleMusic}
           className={`w-full flex items-center justify-between p-3 border font-mono text-xs transition-colors ${
               isPlaying 
               ? 'border-amber-500 bg-amber-500/20 text-amber-400' 
               : 'border-amber-800/50 text-amber-800 hover:border-amber-600 hover:text-amber-600'
           }`}
       >
           <span className="flex items-center gap-2"><Volume2 size={14} /> AUDIO_AMBIENCE</span>
           {isPlaying ? <Check size={14} /> : <span>OFF</span>}
       </button>
    );
 }

  return (
    <button 
      onClick={toggleMusic}
      className={`flex items-center justify-between w-full px-3 py-3 border-2 transition-all duration-300 shadow-hard group
        ${isPlaying 
          ? 'bg-ash-light text-ash-black border-ash-light' 
          : 'bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {isPlaying && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
        </div>
        <span className="text-[10px] font-mono font-bold uppercase">
            Ambience
        </span>
      </div>
      
      {isPlaying && <Activity size={12} className="animate-pulse" />}
      {!isPlaying && <span className="text-[10px] font-mono font-bold">OFF</span>}
    </button>
  );
};

export default BackgroundMusic;
