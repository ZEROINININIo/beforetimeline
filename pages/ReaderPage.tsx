import React, { useState, useEffect, useRef } from 'react';
import { novelData } from '../data/novelData';
import { BookOpen, List, ChevronLeft, ChevronRight, Image as ImageIcon, FileText, Activity, AlertTriangle, Terminal } from 'lucide-react';
import { ChapterTranslation, Language } from '../types';
import Reveal from '../components/Reveal';

interface ReaderPageProps {
  currentIndex: number;
  onChapterChange: (index: number) => void;
  language: Language;
}

// Special collapsible component for Void logs
const VoidLog = ({ lines }: { lines: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Reveal>
      <div className="my-10 border-l-4 border-fuchsia-600 bg-fuchsia-950/10 font-mono text-xs md:text-sm shadow-[0_0_15px_-3px_rgba(192,38,211,0.2)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 md:p-4 bg-fuchsia-950/20 hover:bg-fuchsia-900/30 text-fuchsia-300 font-bold flex items-center gap-3 transition-all group border-b border-fuchsia-500/20"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
             <AlertTriangle size={16} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
             <span className="animate-pulse tracking-widest text-fuchsia-400">>>> SYSTEM_INTERCEPT // 0000.2_VOID</span>
             <span className="text-[10px] bg-fuchsia-900/50 px-1 border border-fuchsia-500/30 text-fuchsia-200/70">
                ENCRYPTION: UNSTABLE
             </span>
          </div>
          <span className="ml-auto opacity-50 text-[10px] group-hover:opacity-100 transition-opacity">[CLICK_TO_DECODE]</span>
        </button>
        
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 md:p-6 text-fuchsia-100/90 space-y-2 leading-relaxed tracking-wide font-medium bg-black/20 backdrop-blur-sm">
              {lines.map((line, i) => {
                  // Clean up the markers for display
                  const cleanLine = line
                    .replace(/0000\.2Void>>/, '')
                    .replace(/【插入结束】|【插入結束】|\[INSERTION_END\]/, '');
                    
                  if (!cleanLine.trim()) return <br key={i}/>;
                  
                  return (
                    <p key={i} className="border-l border-fuchsia-500/20 pl-3 hover:border-fuchsia-500 hover:bg-fuchsia-500/5 transition-colors duration-300">
                        {cleanLine}
                    </p>
                  );
              })}
              <div className="mt-4 pt-2 border-t border-dashed border-fuchsia-500/30 text-[10px] text-fuchsia-500 text-right">
                  // LOG_END // CONNECTION_TERMINATED
              </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const ReaderPage: React.FC<ReaderPageProps> = ({ currentIndex, onChapterChange, language }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const currentChapter = novelData.chapters[currentIndex];
  // Safe access to translation, fallback to CN if missing (though data ensures it's there)
  const translation: ChapterTranslation = currentChapter.translations[language] || currentChapter.translations['zh-CN'];

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    try {
      const historyKey = 'nova_history';
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const newEntry = {
        chapterId: currentChapter.id,
        chapterIndex: currentIndex,
        title: translation.title,
        timestamp: Date.now()
      };
      const filteredHistory = history.filter((h: any) => h.chapterIndex !== currentIndex);
      const updatedHistory = [newEntry, ...filteredHistory].slice(50);
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, [currentIndex, currentChapter, translation.title]);

  // Reset scroll on chapter change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < novelData.chapters.length - 1) {
      onChapterChange(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onChapterChange(currentIndex - 1);
    }
  };

  // Custom content renderer to handle special blocks like Void Logs
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let buffer: string[] = [];
    let inVoidBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for Void Block Markers
        const isVoidStart = trimmed.includes('0000.2Void>>');
        const isVoidEnd = trimmed.includes('【插入结束】') || trimmed.includes('【插入結束】');

        if (isVoidStart) {
            inVoidBlock = true;
            buffer = []; // Start new buffer
            buffer.push(line);
            
            // Handle single-line void block
            if (isVoidEnd) {
                inVoidBlock = false;
                nodes.push(<VoidLog key={`void-${i}`} lines={[...buffer]} />);
                buffer = [];
            }
            continue;
        }

        if (inVoidBlock) {
            buffer.push(line);
            if (isVoidEnd) {
                inVoidBlock = false;
                nodes.push(<VoidLog key={`void-${i}`} lines={[...buffer]} />);
                buffer = [];
            }
            continue;
        }

        // --- Normal Content Processing ---

        if (!trimmed) {
            nodes.push(<br key={`br-${i}`} />);
            continue;
        }

        // Tech Separator Handling
        if (trimmed === '[[DIVIDER]]') {
            nodes.push(
                <Reveal key={`div-${i}`}>
                    <div className="my-12 flex items-center justify-center gap-4 opacity-50 select-none">
                    <div className="h-px bg-ash-light flex-1 bg-gradient-to-r from-transparent via-ash-light to-transparent" />
                    <div className="flex flex-col items-center gap-1">
                        <Activity size={16} className="text-ash-light animate-pulse" />
                        <div className="text-[10px] font-mono tracking-[0.3em] text-ash-light">DATA_SEGMENT</div>
                    </div>
                    <div className="h-px bg-ash-light flex-1 bg-gradient-to-r from-transparent via-ash-light to-transparent" />
                    </div>
                </Reveal>
            );
            continue;
        }

        // Parse custom image syntax: [[IMAGE::URL::CAPTION]]
        const imageMatch = trimmed.match(/\[\[IMAGE::(.*?)::(.*?)\]\]/);
        if (imageMatch) {
            const [_, src, caption] = imageMatch;
            nodes.push(
                <Reveal key={`img-${i}`} className="my-12 flex flex-col items-center w-full">
                    <div className="relative border-4 border-ash-light p-2 bg-ash-dark max-w-full shadow-hard group">
                            {/* Decorative Corner Screws */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-ash-black border border-ash-gray z-10 flex items-center justify-center text-[8px] text-ash-gray">+</div>
                            
                            <div className="relative overflow-hidden bg-ash-black">
                            <img 
                                src={src} 
                                alt={caption}
                                className="relative max-h-[600px] w-auto object-cover block grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                            />
                            {/* Scanline/Texture Overlay */}
                            <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
                            </div>

                            {/* Caption Label */}
                            <div className="absolute bottom-4 right-4 z-20">
                                <div className="bg-ash-light text-ash-black px-3 py-1 text-[10px] font-mono font-bold border-2 border-ash-black shadow-hard-sm flex items-center gap-2 uppercase">
                                <ImageIcon size={12} strokeWidth={3} />
                                {caption}
                                </div>
                            </div>
                    </div>
                </Reveal>
            );
            continue;
        }

        // Standard Paragraph
        nodes.push(
            <Reveal key={`p-${i}`}>
                <p className="mb-6 md:mb-8 text-justify indent-8 md:indent-12 font-mono text-sm md:text-base leading-relaxed text-ash-light">
                    {line}
                </p>
            </Reveal>
        );
    }
    return nodes;
  };

  return (
    <div className="flex h-full relative overflow-hidden bg-retro-paper text-zinc-950">
      {/* Chapter Sidebar */}
      <aside 
        className={`absolute md:relative z-20 h-full bg-ash-black border-r-4 border-ash-dark transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:-translate-x-0 overflow-hidden'
        }`}
      >
        <div className="p-4 border-b-2 border-ash-gray flex justify-between items-center bg-ash-black text-ash-light">
          <h3 className="font-bold font-mono text-sm uppercase flex items-center gap-2">
            <List size={16} /> DIR: /CHAPTERS
          </h3>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-ash-gray hover:text-ash-light">
            <ChevronLeft />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] p-0">
          {novelData.chapters.map((chapter, index) => {
            const chapTitle = chapter.translations[language]?.title || chapter.translations['zh-CN'].title;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onChapterChange(index);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-4 text-xs font-mono border-b border-ash-dark transition-none group ${
                  index === currentIndex
                    ? 'bg-ash-light text-ash-black'
                    : 'text-ash-gray hover:bg-ash-dark hover:text-ash-white'
                }`}
              >
                <div className="font-bold truncate uppercase mb-1">
                  {index === currentIndex && <span className="mr-2">></span>}
                  {chapTitle}
                </div>
                <div className="opacity-60">{chapter.date}</div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Sidebar Toggle */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 z-10 p-2 bg-ash-black text-ash-light border-2 border-ash-light hover:bg-ash-light hover:text-ash-black shadow-hard"
        >
          <List size={20} />
        </button>
      )}

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth relative bg-ash-black">
        <div 
          key={currentIndex} 
          className="max-w-4xl mx-auto min-h-full bg-ash-black border-l-0 md:border-l-2 md:border-r-2 border-ash-dark/50 shadow-2xl relative animate-slide-in"
        >
            
          {/* Paper Header */}
          <div className="px-8 py-12 md:px-16 md:py-16 border-b-4 border-double border-ash-gray bg-ash-black text-ash-light mt-12 md:mt-0">
            <Reveal>
              <div className="flex justify-between items-start mb-6 font-mono text-[10px] text-ash-gray uppercase tracking-widest">
                  <span>NOVA_ARCHIVE // {currentChapter.id}</span>
                  <span>PG_INDEX: {currentIndex + 1}</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-tight">
                  {translation.title}
              </h1>
              
              <div className="flex items-center gap-2 text-xs font-mono text-ash-gray bg-ash-dark inline-block px-3 py-1 border border-ash-gray">
                  <FileText size={12} />
                  <span>{currentChapter.date}</span>
              </div>
            </Reveal>
          </div>

          <article className="px-8 py-12 md:px-16 max-w-none text-ash-light font-serif leading-loose tracking-wide">
            {renderContent(translation.content)}
          </article>

          {/* Footer Nav */}
          <div className="p-8 md:p-16 border-t-4 border-double border-ash-gray bg-ash-dark">
             <div className="flex justify-between items-center gap-4">
                 <button 
                   onClick={handlePrev}
                   disabled={currentIndex === 0}
                   className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono"
                 >
                   <ChevronLeft size={16} /> PREV_FILE
                 </button>

                 <div className="hidden md:block font-mono text-xs text-ash-gray">
                   - END OF RECORD -
                 </div>

                 <button 
                   onClick={handleNext}
                   disabled={currentIndex === novelData.chapters.length - 1}
                   className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-ash-gray text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-ash-gray transition-colors uppercase font-bold text-sm font-mono"
                 >
                   NEXT_FILE <ChevronRight size={16} />
                 </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReaderPage;