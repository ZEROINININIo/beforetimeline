
import { Language } from '../types';

export interface DialogueOption {
  label: Record<Language, string>;
  nextId: string;
  action?: () => void; // Optional trigger for effects
}

export interface DialogueNode {
  id: string;
  speaker: string; // 'System' | 'Byaki' | '???'
  text: Record<Language, string>;
  options: DialogueOption[];
  imageExpression?: 'neutral' | 'sad' | 'glitch'; // For visual variance
}

export const scriptData: Record<string, DialogueNode> = {
  'init': {
    id: 'init',
    speaker: 'System',
    text: {
      'zh-CN': '正在尝试捕获信号...\n频段：0x992... 锁定。\n连接建立。',
      'zh-TW': '正在嘗試捕獲信號...\n頻段：0x992... 鎖定。\n連接建立。',
      'en': 'ATTEMPTING TO CAPTURE ANY SIGNAL...\nBAND: 0x992... LOCKED.\nCONNECTION ESTABLISHED.'
    },
    options: [
      { label: { 'zh-CN': '接入终端', 'zh-TW': '接入終端', 'en': 'ACCESS_TERMINAL' }, nextId: 'start' }
    ]
  },
  'start': {
    id: 'start',
    speaker: '???',
    text: {
      'zh-CN': '...滋...滋...能听到吗？\n这里是临时通讯频道 T-04。',
      'zh-TW': '...滋...滋...能聽到嗎？\n這裡是臨時通訊頻道 T-04。',
      'en': '...zzzt... hear me?\nThis is temporary channel T-04.'
    },
    options: [
      { label: { 'zh-CN': '你是谁？', 'zh-TW': '妳是誰？', 'en': 'Identify yourself.' }, nextId: 'identify' },
      { label: { 'zh-CN': '保持沉默', 'zh-TW': '保持沉默', 'en': 'Stay silent.' }, nextId: 'silence' }
    ]
  },
  'identify': {
    id: 'identify',
    speaker: 'Z.Byaki',
    imageExpression: 'neutral',
    text: {
      'zh-CN': '看来接收端工作正常。\n我是白栖。不过，你应该是在很久之后才收到这条讯息的吧。',
      'zh-TW': '看來接收端工作正常。\n我是白栖。不過，妳應該是在很久之後才收到這條訊息的吧。',
      'en': 'Receiver functional.\nI am Byaki. Though, you likely received this message long after I sent it.'
    },
    options: [
      { label: { 'zh-CN': '我现处的世界很安全。', 'zh-TW': '現在的世界很安全。', 'en': 'The world is safe now.' }, nextId: 'safe' },
      { label: { 'zh-CN': '为什么叫“临时”？', 'zh-TW': '為什麼叫「臨時」？', 'en': 'Why "Temporary"?' }, nextId: 'why_temp' }
    ]
  },
  'silence': {
    id: 'silence',
    speaker: 'Z.Byaki',
    imageExpression: 'sad',
    text: {
      'zh-CN': '没有回应吗... 也许是信号衰减太严重了。\n但我还是想把这句话留在这里。',
      'zh-TW': '沒有回應嗎... 也許是信號衰減太嚴重了。\n但我還是想把這句話留在這裡。',
      'en': 'No response... Signal decay must be severe.\nBut I want to leave this here anyway.'
    },
    options: [
      { label: { 'zh-CN': '我在听。', 'zh-TW': '我在聽。', 'en': 'I am listening.' }, nextId: 'identify' }
    ]
  },
  'safe': {
    id: 'safe',
    speaker: 'Z.Byaki',
    imageExpression: 'neutral',
    text: {
      'zh-CN': '是吗... 那就好。',
      'zh-TW': '是嗎... 那就好。',
      'en': 'Is it... That is good.\nKnowing thai mind.'
    },
    options: [
      { label: { 'zh-CN': '什么按钮？', 'zh-TW': '什麼按鈕？', 'en': 'What button?' }, nextId: 'quantum_observation' }
    ]
  },
  'quantum_observation': {
    id: 'quantum_observation',
    speaker: 'Z.Byaki',
    imageExpression: 'glitch',
    text: {
      'zh-CN': '安全只是表象。',
      'zh-TW': '安全只是表象。',
      'en': 'Safety is merely a facade.\nI can still observe the data stream collapsing on this side.\nBeware of the .'
    },
    options: [
      { label: { 'zh-CN': '我会注意的。', 'zh-TW': '我會注意的。', 'en': 'I will take note.' }, nextId: 'end_loop' },
      { label: { 'zh-CN': '是谁？', 'zh-TW': '是誰？', 'en': 'Who is the ' }, nextId: 'observer_detail' }
    ]
  },
  'observer_detail': {
      id: 'observer_detail',
      speaker: 'System',
      text: {
          'zh-CN': '【数据删除】\n检测到非法关键词访问。\n强制断开连接。',
          'zh-TW': '【數據刪除】\n檢測到非法關鍵詞訪問。\n強制斷開連接。',
          'en': '[DATA EXPUNGED]\nILLEGAL KEYWORD ACCESS DETECTED.\nCONNECTION TERMINATED.'
      },
      options: [
          { label: { 'zh-CN': '[断开]', 'zh-TW': '[斷開]', 'en': '[DISCONNECT]' }, nextId: 'EXIT' }
      ]
  },
  'why_temp': {
    id: 'why_temp',
    speaker: 'Z.Byaki',
    imageExpression: 'glitch',
    text: {
      'zh-CN': '因为它注定会被删除。',
      'zh-TW': '因為它註定會被刪除。',
      'en': 'Because it is destined for deletion.'
    },
    options: [
      { label: { 'zh-CN': '...', 'zh-TW': '...', 'en': '...' }, nextId: 'end_loop' }
    ]
  },
  'end_loop': {
    id: 'end_loop',
    speaker: 'System',
    text: {
      'zh-CN': '通信中断。\n信号源已离线。\n感谢您的收听。这只是一个临时测试，临时测试，不关乎章节剧情内容，这只是一个测试！',
      'zh-TW': '通信中斷。\n信號源已離線。\n感謝您的收聽。這只是一個臨時測試，臨時測試，不關乎章節劇情內容，這只是一個測試！',
      'en': 'TRANSMISSION INTERRUPTED.\nSOURCE OFFLINE.\nTHANK YOU FOR LISTENING.'
    },
    options: [
      { label: { 'zh-CN': '[退出终端]', 'zh-TW': '[退出終端]', 'en': '[EXIT TERMINAL]' }, nextId: 'EXIT' }
    ]
  }
};
