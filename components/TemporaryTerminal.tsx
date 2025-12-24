
import React, { useState, useEffect, useRef } from 'react';
import { X, Radio, ChevronRight, Terminal, Wifi, Battery, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import Reveal from './Reveal';
import { scriptData } from '../data/terminalScript';

interface TemporaryTerminalProps {
  onClose: () => void;
  language: Language;
}

const TemporaryTerminal: React.FC<TemporaryTerminalProps> = ({ onClose, language }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('init');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const currentNode = scriptData[currentNodeId];
  const fullText = currentNode.text[language] || currentNode.text['en'];

  // Typing Effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const speed = 40; 

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [currentNodeId, language, fullText]);

  const handleOptionClick = (nextId: string) => {
    if (nextId === 'EXIT') {
      onClose();
    } else {
      setCurrentNodeId(nextId);
    }
  };

  // Instant text completion on click if typing
  const handleContentClick = () => {
    if (isTyping) {
        setDisplayedText(fullText);
        setIsTyping(false);
    }
  };

  const isGlitch = currentNode.imageExpression === 'glitch';

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in font-mono">
        <div className="w-full max-w-2xl bg-zinc-950 border-2 border-emerald-900/50 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col relative overflow-hidden h-[80vh] md:h-auto md:min-h-[500px]">
            
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
            
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-emerald-900/50 bg-emerald-950/20 text-emerald-500 z-10 shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest">
                    <Radio size={14} className="animate-pulse" />
                    TEMP_TERMINAL // T-04
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1"><Wifi size={10} /> 12ms</span>
                    <span className="flex items-center gap-1"><Battery size={10} /> 14%</span>
                    <button onClick={onClose} className="hover:text-emerald-300 transition-colors"><X size={16} /></button>
                </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
                
                {/* Visual / Portrait Area */}
                <div className="w-full md:w-1/3 bg-black/50 border-b md:border-b-0 md:border-r border-emerald-900/30 relative min-h-[200px] md:min-h-full flex items-center justify-center p-4">
                    {currentNode.speaker === 'Z.Byaki' ? (
                        <div className={`relative w-32 h-32 md:w-40 md:h-40 border border-emerald-800/50 p-1 ${isGlitch ? 'animate-shake-violent' : ''}`}>
                            <img 
                                src="https://cik07-cos.7moor-fs2.com/im/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/d19ea972df034757/byq.jpg" 
                                alt="Byaki" 
                                className={`w-full h-full object-cover filter sepia hue-rotate-50 contrast-125 saturate-50 ${isGlitch ? 'opacity-50 blur-[1px]' : 'opacity-80'}`} 
                            />
                            <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
                            {isGlitch && (
                                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse mix-blend-color-dodge"></div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-emerald-900/80 text-emerald-400 text-[9px] px-1 font-bold">
                                IMG_SRC: MEMORY
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-emerald-900/50 rounded-full flex items-center justify-center animate-spin-slow opacity-50">
                            <Terminal size={32} className="text-emerald-700" />
                        </div>
                    )}
                </div>

                {/* Text Interaction Area */}
                <div className="flex-1 flex flex-col p-4 md:p-6 bg-zinc-950/80" onClick={handleContentClick}>
                    {/* Speaker Label */}
                    <div className="mb-4 text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                        {currentNode.speaker}
                    </div>

                    {/* Dialogue Text */}
                    <div className="flex-1 font-mono text-sm md:text-base text-emerald-400 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                        {displayedText}
                        <span className={`inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle ${isTyping ? 'animate-none' : 'animate-[blink_1s_infinite]'}`}></span>
                    </div>

                    {/* Options (Only show when not typing) */}
                    {!isTyping && (
                        <div className="mt-6 space-y-2 animate-slide-in">
                            {currentNode.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(opt.nextId);
                                    }}
                                    className="w-full text-left p-3 border border-emerald-900/50 bg-emerald-950/30 text-emerald-500 text-xs md:text-sm font-bold hover:bg-emerald-900/50 hover:text-emerald-300 hover:border-emerald-500/50 transition-all flex items-center group"
                                >
                                    <span className="w-4 opacity-50 group-hover:opacity-100 transition-opacity">{'>'}</span>
                                    {opt.label[language] || opt.label['en']}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-emerald-900/50 bg-black text-[9px] text-emerald-800 flex justify-between uppercase z-10 shrink-0">
                <span>MEM_USAGE: 404KB</span>
                <span>SECURE_CONN_V2</span>
            </div>
        </div>
    </div>
  );
};

export default TemporaryTerminal;
