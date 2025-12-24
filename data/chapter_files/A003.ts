
import { Chapter } from '../../types';

export const chapterA003: Chapter = {
  id: "locked-chapter-003",
  date: "档案记录: A-003",
  status: 'locked',
  translations: {
    'zh-CN': {
      title: "空白档案 // 待录入",
      summary: "该节点内容已被重置，等待操作员手动录入数据。",
      content: "DATA_CLEARED // AWAITING_INPUT"
    },
    'zh-TW': {
      title: "空白檔案 // 待錄入",
      summary: "該節點內容已被重置，等待操作員手動錄入數據。",
      content: "DATA_CLEARED // AWAITING_INPUT"
    },
    'en': {
      title: "EMPTY_FILE // PENDING",
      summary: "Content reset. Waiting for manual operator input.",
      content: "DATA_CLEARED // AWAITING_INPUT"
    }
  }
};
