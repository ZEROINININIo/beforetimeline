
import { SideStoryVolume, Chapter } from '../types';
import { chapterS001 } from './side_story_files/S001';
import { chapterS002 } from './side_story_files/S002';
import { chapterS003 } from './side_story_files/S003';
import { chapterS004 } from './side_story_files/S004';
import { chapterX001 } from './side_story_files/X001';
import { chapterX002 } from './side_story_files/X002';
import { chapterX003 } from './side_story_files/X003';
import { chapterSLegacy } from './side_story_files/S_Legacy';
import { chapterF001 } from './side_story_files/F001';
import { chapterF002 } from './side_story_files/F002';
import { chapterExb001 } from './side_story_files/Exb001';

// Helper to create garbled chapters
const createGarbledChapter = (id: string, dateLabel: string): Chapter => ({
  id: id,
  date: dateLabel,
  status: 'locked',
  translations: {
    'zh-CN': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" },
    'zh-TW': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" },
    'en': { title: "▞▞▞▞▞▞", content: "", summary: "FILE_CORRUPTED" }
  }
});

export const sideStoryVolumes: SideStoryVolume[] = [
  {
    id: "VOL_VARIABLE",
    title: "被保留的变量",
    titleEn: "The Preserved Variable",
    status: 'unlocked',
    chapters: [
        chapterF001,
        chapterF002, // Added Byaki's Room scene
        chapterExb001, // Byaki's Diary
        createGarbledChapter("F_ERR", "档案记录: F-NULL")
    ]
  },
  {
    id: "VOL_MEMORIES",
    title: "那场仍未结束的零碎之雨",
    titleEn: "The Fragmented Rain That Never Ended",
    status: 'unlocked',
    chapters: [
      chapterS001,
      chapterS002,
      chapterS003,
      chapterS004,
      chapterSLegacy 
    ]
  },
  {
    id: "VOL_DAILY",
    title: "时域日常", 
    titleEn: "Time Line Daily",
    status: 'unlocked',
    chapters: [
        chapterX001,
        chapterX002,
        chapterX003,
        // Garbled Chapters
        createGarbledChapter("ERR_004", "档案记录: X-004"),
    ]
  },
  {
    id: "VOL_UNKNOWN",
    title: "▓▓▓▓▓▓",
    titleEn: "UNKNOWN_SECTOR",
    status: 'corrupted',
    chapters: []
  }
];
