import { Character } from '../types';

export const characters: Character[] = [
  {
    id: "point",
    name: "零点",
    alias: "Z.Point",
    role: "前线",
    tags: ["活力", "搞事", "直觉系"],
    quote: "只要跑得够快，麻烦就追不上我！……大概？",
    themeColor: "text-zinc-400",
    stats: {
      strength: 5,
      intelligence: 8,
      agility: 9,
      mental: 7,
      resonance: 10
    },
    description: [
      "团队的主心骨，性格活泼外向，具有极高的独立性。",
      "脑袋里经常装着小坏心思，容易吃苦头，但恢复得也快。",
      "和芷漓、泽洛都很亲密，是从小到大一直陪伴着的伙伴。",
      "对公行动较保守，但对重要任务有自己的盘算，且拥有三人中最强的隐形实力。"
    ]
  },
  {
    id: "zeri",
    name: "芷漓",
    alias: "Z.Zeri / Liz",
    role: "科研",
    tags: ["冷静"],
    quote: "数据不会说谎，但解读数据的人经常犯蠢。",
    themeColor: "text-pink-400",
    stats: {
      strength: 2,
      intelligence: 11,
      agility: 5,
      mental: 2,
      resonance: 5
    },
    description: [
      "安静、沉稳、理性，典型的冷系科研型人格。",
      "生活规律、家里整洁，有点小洁癖气质。对工作极度认真，脑子里永远是研究与任务。",
      "表面淡定，实际上偶尔会耍小心机（例如诱骗零点加班）。",
      "嘴硬心软，非常关心队友，尤其是零点。低调害羞，不喜欢别人叫她“小名”，也不喜欢穿可爱的衣服。"
    ]
  },
  {
    id: "zelo",
    name: "泽洛",
    alias: "Z.Zelo",
    role: "支援",
    tags: ["元气","乐观主义"],
    quote: "不管发生什么，我都会全力支持计划哦~",
    themeColor: "text-blue-400",
    stats: {
      strength: 4,
      intelligence: 5,
      agility: 6,
      mental: 10,
      resonance: 5
    },
    description: [
      "性格外向活泼，对任何事情都充满希望。",
      "有时像小孩般贪玩，对工作不太上心，经常充当实验辅助员。",
      "有自己的需求时并不强迫他人帮助。",
      "对零点和芷漓都很了解，是亲人般的存在。可爱系角色，不管哪方面都透露着少女感。"
    ]
  },
  {
    id: "void",
    name: "零空",
    alias: "Void",
    role: "？？？",
    tags: ["神秘", "高维", "BUG"],
    quote: "干涉。",
    themeColor: "text-white",
    stats: {
      strength: 0,
      intelligence: 10,
      agility: 10,
      mental: 0,
      resonance: 10
    },
    description: [
      "来自“空界”的高位存在，和三人关系特殊。",
      "拥有无限的生命和特殊的记忆系统。实力非常强，能轻松完成现实上任何难以做到的事情。",
      "看似散漫，但在关键节点非常可靠。",
      "对零点比较宠，会帮忙但也让零点不要经常召唤它（会损害零点）。"
    ]
  },
];