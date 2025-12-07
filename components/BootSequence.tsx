import React, { useEffect, useState } from 'react';
import { AlertTriangle, Terminal, Cpu, CheckCircle } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
  isNormalBoot?: boolean; // If true, skip the crash/recovery drama
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, isNormalBoot = false }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<'BIOS' | 'ERROR' | 'RECOVERY' | 'NORMAL'>('BIOS');

  useEffect(() => {
    // Normal Boot Sequence (Fast, clean)
    if (isNormalBoot) {
        const bootLines = [
            "NOVA_BIOS v.3.1.4 (STABLE)",
            "VERIFYING_INTEGRITY... OK",
            "LOADING_USER_PROFILE... FOUND",
            "CONNECTING_TO_ARCHIVE... ESTABLISHED",
            "DECRYPTING_DATA_STREAMS...",
            "WELCOME_BACK_OPERATOR."
        ];

        let delay = 0;
        bootLines.forEach((line) => {
            delay += 150 + Math.random() * 100;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, delay);
        });

        setTimeout(onComplete, delay + 800);
        return;
    }

    // Crash Boot Sequence (Original)
    // Phase 1: BIOS Init (Fast)
    const biosLines = [
      "NOVA_BIOS v.0.0.1a (LEGACY)",
      "CHECKING_MEM... OK",
      "CHECKING_CPU... OK",
      "LOADING_KERNEL...",
      "MOUNTING_VIRTUAL_DRIVES..."
    ];

    let delay = 0;
    biosLines.forEach((line, i) => {
      delay += Math.random() * 200;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
      }, delay);
    });

    // Phase 2: CRASH (Delayed)
    setTimeout(() => {
      setPhase('ERROR');
      const errorLines = [
        "CRITICAL_ERROR: SECTOR 0x00F21 CORRUPTED",
        "KERNEL_PANIC: UNEXPECTED_INTERRUPT",
        "REALITY_ANCHOR... LOST",
        "ATTEMPTING_DUMP...",
        "DUMP_FAILED.",
        "SYSTEM_HALTED."
      ];
      
      let errDelay = 0;
      errorLines.forEach((line, i) => {
        errDelay += 150;
        setTimeout(() => {
            setLines(prev => [...prev, `>> ${line}`]);
        }, errDelay);
      });
      
    }, delay + 500);

    // Phase 3: RECOVERY (Delayed)
    setTimeout(() => {
        setPhase('RECOVERY');
        setLines([]); // Clear screen
        const recoverLines = [
            "INITIATING_SAFE_MODE...",
            "BYPASSING_DAMAGED_SECTORS...",
            "LOADING_BACKUP_CONFIG...",
            "RESTORING_USER_INTERFACE...",
            "PLEASE_CONFIGURE_SYSTEM_PARAMETERS."
        ];

        let recDelay = 0;
        recoverLines.forEach(line => {
            recDelay += 800;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, recDelay);
        });

        setTimeout(onComplete, recDelay + 1000);

    }, delay + 2500);

  }, [onComplete, isNormalBoot]);

  if (phase === 'ERROR') {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-8 overflow-hidden animate-crash relative z-50">
        <div className="absolute inset-0 bg-red-900/20 z-0"></div>
        <AlertTriangle size={128} className="text-red-500 mb-8 animate-ping" />
        <h1 className="text-6xl md:text-9xl font-black text-red-500 glitch-text-heavy mb-4" data-text="FATAL_ERROR">FATAL_ERROR</h1>
        <div className="font-mono text-red-400 text-sm md:text-xl text-center max-w-2xl space-y-1">
            {lines.slice(-6).map((line, i) => (
                <div key={i} className="bg-red-950/50 px-2">{line}</div>
            ))}
        </div>
        <div className="mt-12 w-full max-w-md h-2 bg-red-900 overflow-hidden">
            <div className="h-full bg-red-500 w-full animate-[glitch_0.2s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen bg-black text-green-500 p-8 font-mono text-xs md:text-sm overflow-hidden flex flex-col justify-end z-50 ${phase === 'RECOVERY' ? 'text-amber-500' : ''}`}>
      <div className="mb-auto opacity-50 flex items-center gap-4">
        {isNormalBoot ? <CheckCircle className="text-green-500" /> : 
         phase === 'BIOS' ? <Cpu className="animate-pulse" /> : 
         <Terminal className="animate-spin" />
        }
        <span>NOVA_LABS_TERMINAL_ACCESS // {isNormalBoot ? 'NORMAL_BOOT' : phase}</span>
      </div>
      
      <div className="space-y-1">
        {lines.map((line, index) => (
          <div key={index} className="animate-fade-in">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </div>
        ))}
        <div className="h-4 w-3 bg-current animate-pulse inline-block mt-2"></div>
      </div>

      {phase === 'RECOVERY' && (
          <div className="absolute inset-0 pointer-events-none border-[20px] border-amber-900/20 animate-pulse"></div>
      )}
    </div>
  );
};

export default BootSequence;