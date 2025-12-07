import React from 'react';
import { ChevronRight, Terminal } from 'lucide-react';
import { Language } from '../types';

interface HomePageProps {
  onStartReading: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const content = {
  'zh-CN': {
    systemMsg: '系统消息 // 广播',
    warning: [
      '> 警告：检测到现实不稳定性。',
      '> 正在访问档案数据库...',
      '> 正在重构碎片化记忆。'
    ],
    button: '启动序列',
    footerId: '终端ID： Void-xpsdvn [被修复]',
    footerLoc: 'Time obj.// 未知节区'
  },
  'zh-TW': {
    systemMsg: '系統訊息 // 廣播',
    warning: [
      '> 警告：偵測到現實不穩定性。',
      '> 正在存取檔案資料庫...',
      '> 正在重構碎片化記憶。'
    ],
    button: '啟動序列',
    footerId: '終端ID： Void-xpsdvn [被修復]',
    footerLoc: 'Time obj.// 未知節區'
  },
  'en': {
    systemMsg: 'SYSTEM_MESSAGE // BROADCAST',
    warning: [
      '> WARNING: REALITY INSTABILITY DETECTED.',
      '> ACCESSING ARCHIVE DATABASE...',
      '> RECONSTRUCTING FRAGMENTED MEMORIES.'
    ],
    button: 'INITIATE_SEQUENCE',
    footerId: 'TERM_ID: Void-xpsdvn [REPAIRED]',
    footerLoc: 'Time obj.// UNKNOWN_SECTOR'
  }
};

const HomePage: React.FC<HomePageProps> = ({ onStartReading, language, setLanguage }) => {
  const t = content[language];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-6 space-y-8 md:space-y-12 bg-halftone relative">
      
      {/* Top Language Display (Read-only/Quick Switch) */}
      <div className="absolute top-0 right-0 p-4 pt-6 flex gap-6 text-xs font-mono z-40 tracking-widest">
        <button 
          onClick={() => setLanguage('zh-CN')} 
          className={`${language === 'zh-CN' ? 'text-ash-light font-bold border-b border-ash-light' : 'text-ash-gray hover:text-ash-light'} transition-colors pb-1`}
        >
          CN
        </button>
        <button 
          onClick={() => setLanguage('zh-TW')} 
          className={`${language === 'zh-TW' ? 'text-ash-light font-bold border-b border-ash-light' : 'text-ash-gray hover:text-ash-light'} transition-colors pb-1`}
        >
          TC
        </button>
        <button 
          onClick={() => setLanguage('en')} 
          className={`${language === 'en' ? 'text-ash-light font-bold border-b border-ash-light' : 'text-ash-gray hover:text-ash-light'} transition-colors pb-1`}
        >
          EN
        </button>
      </div>

      <div className="space-y-4 md:space-y-6 max-w-4xl border-4 border-ash-light p-8 md:p-16 relative">
        {/* Decorative Screws */}
        <div className="absolute top-2 left-2 w-3 h-3 border border-ash-gray bg-ash-black flex items-center justify-center text-[8px] text-ash-gray">+</div>
        <div className="absolute top-2 right-2 w-3 h-3 border border-ash-gray bg-ash-black flex items-center justify-center text-[8px] text-ash-gray">+</div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border border-ash-gray bg-ash-black flex items-center justify-center text-[8px] text-ash-gray">+</div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border border-ash-gray bg-ash-black flex items-center justify-center text-[8px] text-ash-gray">+</div>

        <div className="inline-block bg-ash-light text-ash-black px-2 py-1 text-sm font-bold mb-2 md:mb-4">
            {t.systemMsg}
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-ash-light tracking-tighter uppercase mix-blend-difference">
          TIME LINE // BEFORE
        </h1>
        
        <p className="text-ash-gray font-mono text-xs md:text-base max-w-lg mx-auto border-l-2 border-ash-gray pl-4 text-left">
            {t.warning.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}<br/>
              </React.Fragment>
            ))}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button 
          onClick={onStartReading}
          className="group relative px-8 py-3 md:px-10 md:py-4 bg-ash-black border-2 border-ash-light text-ash-light font-bold text-base md:text-lg hover:bg-ash-light hover:text-ash-black transition-all shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <span className="relative flex items-center gap-3">
            <Terminal size={20} />
            {t.button}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      <div className="absolute bottom-4 right-6 text-xs text-ash-gray font-mono hidden md:block text-right border-t border-dashed border-ash-gray pt-2">
        {t.footerId}<br/>
        {t.footerLoc}
      </div>
    </div>
  );
};

export default HomePage;