import React, { useState } from 'react';
import { Database, Book, Users, Home, Clock, Cpu, Settings, Globe } from 'lucide-react';
import BackgroundMusic from './BackgroundMusic';
import CRTToggle from './CRTToggle';
import ThemeToggle from './ThemeToggle';
import { Language } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  isLightTheme: boolean;
  setIsLightTheme: (val: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
    activeTab, setActiveTab, language, setLanguage,
    crtEnabled, setCrtEnabled, isLightTheme, setIsLightTheme
}) => {
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  const translations = {
    'zh-CN': {
      home: '根控制台',
      characters: '人员档案',
      database: '数据资料',
      reader: '阅读终端',
      history: '系统日志',
      config: '系统设置',
      mobileHome: '主页',
      mobileChars: '人员',
      mobileData: '数据',
      mobileRead: '阅读',
      mobileLogs: '日志'
    },
    'zh-TW': {
      home: '根控制台',
      characters: '人員檔案',
      database: '數據資料',
      reader: '閱讀終端',
      history: '系統日誌',
      config: '系統設置',
      mobileHome: '主頁',
      mobileChars: '人員',
      mobileData: '數據',
      mobileRead: '閱讀',
      mobileLogs: '日誌'
    },
    'en': {
      home: 'ROOT_MENU',
      characters: 'PERSONNEL',
      database: 'DATA_BANK',
      reader: 'READ_MODE',
      history: 'SYS_LOGS',
      config: 'SYS_CONFIG',
      mobileHome: 'ROOT',
      mobileChars: 'TEAM',
      mobileData: 'DATA',
      mobileRead: 'READ',
      mobileLogs: 'LOGS'
    }
  };

  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.home, mobileLabel: t.mobileHome, icon: Home },
    { id: 'characters', label: t.characters, mobileLabel: t.mobileChars, icon: Users },
    { id: 'database', label: t.database, mobileLabel: t.mobileData, icon: Database },
    { id: 'reader', label: t.reader, mobileLabel: t.mobileRead, icon: Book },
    { id: 'history', label: t.history, mobileLabel: t.mobileLogs, icon: Clock },
  ];

  const cycleLanguage = () => {
    if (language === 'zh-CN') setLanguage('zh-TW');
    else if (language === 'zh-TW') setLanguage('en');
    else setLanguage('zh-CN');
  };

  const getLangLabel = () => {
    if (language === 'zh-CN') return '简';
    if (language === 'zh-TW') return '繁';
    return 'EN';
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 md:static md:w-72 md:h-full bg-ash-black border-t-2 md:border-t-0 md:border-r-2 border-ash-light/20 z-50 flex md:flex-col justify-between p-2 md:p-6 shadow-2xl transition-colors duration-300 md:overflow-y-auto no-scrollbar">
        <div className="hidden md:block mb-8 border-b-2 border-ash-light/20 pb-6 shrink-0">
          <div className="flex items-center gap-2 mb-2">
              <Cpu className="text-ash-light animate-pulse" />
              <div className="w-2 h-2 bg-ash-light"></div>
              <div className="w-2 h-2 bg-ash-gray"></div>
          </div>
          <h1 className="text-4xl font-black text-ash-light tracking-tighter uppercase mb-1" style={{ textShadow: '2px 2px 0 #333' }}>
            NOVA<br/>LABS
          </h1>
          <div className="text-[10px] text-ash-gray font-mono bg-ash-dark p-1 inline-block border border-ash-gray">
            ARCHIVE_SYS // V.3.1_LEGACY
          </div>
        </div>

        <div className="flex md:flex-col justify-between md:justify-start w-full gap-1 md:gap-3 md:mb-auto shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileSettings(false);
              }}
              className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start py-2 md:px-4 md:py-4 border-2 transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id
                  ? 'bg-ash-light text-ash-black border-ash-light shadow-hard'
                  : 'bg-ash-black text-ash-gray border-ash-gray/30 hover:border-ash-light hover:text-ash-light'
              }`}
            >
              {/* Active Indicator Pattern */}
              {activeTab === item.id && (
                  <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
              )}

              <item.icon size={18} className="mb-1 md:mb-0 md:mr-3 z-10" strokeWidth={2.5} />
              
              {/* Desktop Label */}
              <span className="hidden md:inline text-sm font-bold tracking-widest z-10 whitespace-normal text-left">{item.label}</span>
              
              {/* Mobile Label */}
              <span className="md:hidden text-[10px] font-bold tracking-widest z-10 whitespace-nowrap">{item.mobileLabel}</span>
            </button>
          ))}
          
          {/* Mobile Settings Toggle */}
          <button
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className={`flex-1 md:hidden flex flex-col items-center justify-center py-2 border-2 transition-all duration-300 group relative overflow-hidden ${
              showMobileSettings
                ? 'bg-ash-light text-ash-black border-ash-light shadow-hard'
                : 'bg-ash-black text-ash-gray border-ash-gray/30 hover:border-ash-light hover:text-ash-light'
            }`}
          >
            {showMobileSettings && (
                <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none" />
            )}
            <Settings size={18} className="mb-1 z-10" strokeWidth={2.5} />
            <span className="text-[10px] font-bold tracking-widest z-10">CFG</span>
          </button>
        </div>

        {/* System Configuration Controls (Desktop Only) */}
        <div className="hidden md:flex flex-col gap-2 mt-8 border-t-2 border-dashed border-ash-gray/30 pt-6 shrink-0">
          <div className="text-[10px] text-ash-gray font-mono mb-1 uppercase px-1">[SYSTEM_CONFIG]</div>
          <button 
            onClick={cycleLanguage}
            className="flex items-center justify-between w-full px-3 py-3 border-2 transition-all duration-300 shadow-hard bg-ash-black text-ash-gray border-ash-gray/50 hover:border-ash-light hover:text-ash-light group"
          >
            <div className="flex items-center gap-3">
              <Globe size={16} />
              <span className="text-[10px] font-mono font-bold uppercase">Language</span>
            </div>
            <span className="text-[10px] font-mono font-bold">{getLangLabel()}</span>
          </button>
          <BackgroundMusic />
          <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} />
          <ThemeToggle value={isLightTheme} onChange={setIsLightTheme} />
        </div>

        <div className="hidden md:block mt-6 pt-4 border-t-2 border-dashed border-ash-gray/30 text-ash-gray text-[10px] font-mono leading-tight shrink-0">
          <p className="mb-2">[CONNECTION_STATUS]</p>
          <div className="w-full bg-ash-dark h-2 border border-ash-gray mb-1">
              <div className="bg-ash-light h-full w-[98%] animate-pulse"></div>
          </div>
          <p>> ENCRYPTION: STATIC</p>
          <p>> PING: 0.04ms</p>
        </div>
      </nav>

      {/* Mobile Settings Overlay */}
      {showMobileSettings && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-[2px]" onClick={() => setShowMobileSettings(false)}>
            <div 
                className="absolute bottom-[90px] left-4 right-4 bg-ash-black border-2 border-ash-light p-5 shadow-hard animate-slide-in z-50 max-h-[70vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 border-b-2 border-ash-gray/30 pb-2">
                    <div className="flex items-center gap-2">
                        <Settings size={16} className="text-ash-light" />
                        <span className="text-xs font-bold text-ash-light font-mono uppercase tracking-wider">{t.config}</span>
                    </div>
                    <div className="text-[10px] text-ash-gray font-mono">V.3.1</div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button 
                      onClick={cycleLanguage}
                      className="flex items-center justify-between w-full px-3 py-3 border-2 transition-all duration-300 shadow-hard bg-ash-black text-ash-gray border-ash-gray/50 active:border-ash-light active:text-ash-light group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={16} />
                        <span className="text-[10px] font-mono font-bold uppercase">Language</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">{getLangLabel()}</span>
                    </button>
                    <BackgroundMusic />
                    <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} />
                    <ThemeToggle value={isLightTheme} onChange={setIsLightTheme} />
                </div>
                
                <div className="mt-4 pt-2 border-t border-dashed border-ash-gray/30 text-[10px] text-ash-gray font-mono text-center">
                    NOVA_LABS_ARCHIVE // SYSTEM_OVERLAY
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Navigation;