export type Language = 'zh-CN' | 'zh-TW' | 'en';

export interface CharacterStats {
  strength: number;    // 强度/破坏力
  intelligence: number;// 智力/演算力
  agility: number;     // 机动/反应
  mental: number;      // 精神/抗性
  resonance: number;   // 共鸣/量子适应性
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  role: string;
  description: string[];
  tags: string[];
  stats: CharacterStats;
  quote?: string;
  themeColor?: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  category: 'World' | 'Organization' | 'Technology' | 'Society';
  content: string[]; // Array of paragraphs
}

export interface ChapterTranslation {
  title: string;
  summary?: string;
  content: string;
}

export interface Chapter {
  id: string;
  date: string;
  status?: 'published' | 'locked';
  translations: {
    'zh-CN': ChapterTranslation;
    'zh-TW': ChapterTranslation;
    'en': ChapterTranslation;
  };
}

export interface NovelData {
  title: string;
  subtitle: string;
  intro: string;
  characters: Character[];
  lore: LoreEntry[];
  chapters: Chapter[];
}