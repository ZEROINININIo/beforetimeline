import React, { useState } from 'react';
import { novelData } from '../data/novelData';
import { User, Activity, Shield, Sparkles, Hash, Zap, Cpu, Brain, Heart, Wind } from 'lucide-react';
import { Character, CharacterStats } from '../types';

// Simple Radar Chart Component
const RadarChart = ({ stats, colorClass }: { stats: CharacterStats; colorClass: string }) => {
  const size = 100;
  const center = size / 2;
  const radius = 40;
  const maxStat = 10;
  
  // Calculate points for the pentagon
  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / maxStat) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const statValues = [stats.strength, stats.intelligence, stats.mental, stats.resonance, stats.agility];
  const points = statValues.map((val, i) => getPoint(val, i, 5)).join(' ');
  const fullPoints = Array(5).fill(maxStat).map((val, i) => getPoint(val, i, 5)).join(' ');

  // Helper labels
  const labels = [
    { label: "STR", x: 50, y: 5 },
    { label: "INT", x: 95, y: 35 },
    { label: "MEN", x: 80, y: 95 },
    { label: "RES", x: 20, y: 95 },
    { label: "AGI", x: 5, y: 35 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
        {/* Background Grid (Pentagon) */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
           <polygon 
             key={scale}
             points={Array(5).fill(maxStat * scale).map((val, i) => getPoint(val, i, 5)).join(' ')}
             fill="none"
             stroke="var(--ash-gray)"
             strokeWidth="0.5"
             opacity="0.3"
           />
        ))}
        {/* Axes */}
        {labels.map((_, i) => (
             <line 
                key={i}
                x1={center} y1={center}
                x2={getPoint(maxStat, i, 5).split(',')[0]}
                y2={getPoint(maxStat, i, 5).split(',')[1]}
                stroke="var(--ash-gray)"
                strokeWidth="0.5"
                opacity="0.3"
             />
        ))}

        {/* Data Polygon */}
        <polygon 
          points={points} 
          fill="currentColor" 
          fillOpacity="0.2"
          stroke="currentColor" 
          strokeWidth="2"
          className={colorClass}
        />
        {/* Points */}
        {statValues.map((val, i) => {
            const [x, y] = getPoint(val, i, 5).split(',');
            return <circle key={i} cx={x} cy={y} r="1.5" className={`${colorClass} fill-current`} />
        })}
        
        {/* Labels */}
        {labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="6" fill="var(--ash-gray)" className="font-mono font-bold">{l.label}</text>
        ))}
      </svg>
    </div>
  );
};

const CharactersPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(novelData.characters[0].id);

  const selectedChar = novelData.characters.find(c => c.id === selectedId) || novelData.characters[0];

  const getIcon = (role: string) => {
    if (role.includes('支援') || role.includes('重装')) return <Shield className="w-5 h-5" />;
    if (role.includes('科研') || role.includes('前线')) return <Activity className="w-5 h-5" />;
    if (role.includes('？？？')) return <Sparkles className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const statsList = [
      { label: "STRENGTH", val: selectedChar.stats.strength, icon: Zap },
      { label: "INTELLIGENCE", val: selectedChar.stats.intelligence, icon: Brain },
      { label: "AGILITY", val: selectedChar.stats.agility, icon: Wind },
      { label: "MENTAL", val: selectedChar.stats.mental, icon: Heart },
      { label: "RESONANCE", val: selectedChar.stats.resonance, icon: Cpu },
  ];

  return (
    <div className="flex flex-col h-full bg-halftone overflow-hidden">
      
      {/* Top Header */}
      <header className="p-4 md:p-8 border-b-2 border-ash-dark bg-ash-black z-20 flex justify-between items-center shrink-0">
        <div>
            <h2 className="text-xl md:text-3xl font-black text-ash-light mb-1 uppercase tracking-tighter flex items-center gap-3">
                <User size={24} className="md:w-7 md:h-7" />
                Personnel_File
            </h2>
            <div className="text-[10px] font-mono text-ash-gray flex gap-2">
                <span className="bg-ash-dark px-1">CONFIDENTIAL</span>
                <span>// AUTH_REQ_LEVEL_5</span>
            </div>
        </div>
        <div className="hidden md:block text-right">
             <div className="text-xs text-ash-light font-bold font-mono border border-ash-gray px-2 py-1 inline-block">
                DB_STATUS: ONLINE
             </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
         
         {/* List Selection - Horizontal on mobile, Vertical on desktop */}
         <aside className="w-full md:w-80 border-b-2 md:border-b-0 md:border-r-2 border-ash-dark bg-ash-black overflow-x-auto md:overflow-y-auto shrink-0 z-10 flex flex-row md:flex-col no-scrollbar">
             <div className="flex flex-row md:flex-col p-2 md:p-4 gap-2 md:gap-4 md:space-y-2 min-w-max md:min-w-0">
                 {novelData.characters.map(char => (
                     <button
                        key={char.id}
                        onClick={() => setSelectedId(char.id)}
                        className={`w-32 md:w-full text-left p-2 md:p-4 border-2 transition-all relative overflow-hidden group shrink-0 ${
                            selectedId === char.id 
                            ? 'border-ash-light bg-ash-light text-ash-black shadow-hard' 
                            : 'border-ash-gray/30 bg-ash-dark text-ash-gray hover:border-ash-gray hover:text-ash-white'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-1 z-10 relative">
                            <span className="font-bold uppercase tracking-wider truncate text-xs md:text-base">{char.name}</span>
                            <div className="scale-75 origin-top-right md:scale-100">{getIcon(char.role)}</div>
                        </div>
                        <div className="text-[10px] font-mono opacity-70 z-10 relative truncate">{char.alias}</div>
                        
                        {/* Selected Background Pattern */}
                        {selectedId === char.id && (
                             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
                        )}
                     </button>
                 ))}
             </div>
         </aside>

         {/* Right: Detail View */}
         <main key={selectedChar.id} className="flex-1 overflow-y-auto p-4 md:p-12 relative animate-fade-in bg-ash-black">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Hash size={300} strokeWidth={0.5} />
             </div>
             
             <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                 
                 {/* ID Card Header */}
                 <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start border-b-2 border-dashed border-ash-gray pb-8 md:pb-12">
                     <div className="w-full md:w-1/3 bg-ash-dark p-4 md:p-6 border-2 border-ash-gray shadow-hard relative">
                         {/* Radar Chart Container */}
                         <div className="aspect-square bg-ash-black border border-ash-dark mb-4 flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ash-gray to-transparent"></div>
                             <RadarChart stats={selectedChar.stats} colorClass={selectedChar.themeColor || 'text-ash-light'} />
                             
                             <div className="absolute bottom-2 right-2 text-[10px] font-mono text-ash-gray">
                                 SYNC_RATE: {selectedChar.stats.resonance * 10}%
                             </div>
                         </div>
                         
                         <div className="space-y-2">
                            {statsList.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="flex items-center gap-1 text-ash-gray">
                                        <stat.icon size={10} /> {stat.label}
                                    </span>
                                    <div className="flex gap-[1px]">
                                        {Array(10).fill(0).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-1 h-2 ${i < stat.val ? (selectedChar.themeColor?.replace('text-', 'bg-') || 'bg-ash-light') : 'bg-ash-black border border-ash-dark'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>

                     <div className="flex-1 space-y-4 md:space-y-6">
                         <div>
                             <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-ash-light mb-2">
                                 {selectedChar.name}
                             </h1>
                             <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm font-mono text-ash-gray">
                                 <span className="px-2 py-1 bg-ash-dark border border-ash-gray text-ash-light font-bold">
                                     {selectedChar.alias}
                                 </span>
                                 <span> // ROLE: {selectedChar.role}</span>
                                 <span> // ID: {selectedChar.id.toUpperCase()}</span>
                             </div>
                         </div>

                         {selectedChar.quote && (
                             <div className="border-l-4 border-ash-light pl-4 py-2 italic text-ash-light/80 font-serif text-base md:text-lg">
                                 "{selectedChar.quote}"
                             </div>
                         )}

                         <div className="flex flex-wrap gap-2">
                             {selectedChar.tags.map(tag => (
                                 <span key={tag} className="px-3 py-1 border border-ash-gray rounded-full text-xs font-mono hover:bg-ash-light hover:text-ash-black transition-colors">
                                     #{tag}
                                 </span>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* Dossier Content */}
                 <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
                     <h3 className="text-lg md:text-xl font-bold uppercase border-b border-ash-gray pb-2 flex items-center gap-2">
                         <Activity size={20} /> Field Analysis
                     </h3>
                     <div className="grid md:grid-cols-2 gap-4 md:gap-8 text-sm md:text-base leading-relaxed font-mono text-ash-gray/90">
                         {selectedChar.description.map((para, idx) => (
                             <div key={idx} className="p-3 md:p-4 border border-ash-dark bg-ash-dark/30 hover:bg-ash-dark/50 transition-colors">
                                 <span className="text-ash-light font-bold mr-2">[{String(idx + 1).padStart(2, '0')}]</span>
                                 {para}
                             </div>
                         ))}
                     </div>
                 </div>

             </div>
         </main>
      </div>
    </div>
  );
};

export default CharactersPage;