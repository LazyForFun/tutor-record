import type { TutorRecord } from './types';

export const sampleRecords: TutorRecord[] = [
  {
    id: '1',
    studentName: '王小明',
    nextLessonAt: '2026-09-22T18:30:00',
    progress: '國中數學：二次函數 第 3 章',
    condition: '專注度良好，配方法還需要多練習',
    nextPaymentAt: '2026-10-01T00:00:00',
    homework: '課本 p.85–87 習題 1–10，錯題訂正',
  },
  {
    id: '2',
    studentName: '陳雅婷',
    nextLessonAt: '2026-09-23T16:00:00',
    progress: '高一英文：Unit 4 時態總複習',
    condition: '單字量進步，閱讀速度偏慢',
    nextPaymentAt: '2026-09-30T00:00:00',
    homework: '背 Unit 4 單字 40 個，完成閱讀測驗 2 篇',
  },
  {
    id: '3',
    studentName: '林冠宇',
    nextLessonAt: '2026-09-25T19:00:00',
    progress: '國小五年級數學：分數乘除',
    condition: '上課容易分心，需要多用圖示說明',
    nextPaymentAt: '2026-10-10T00:00:00',
    homework: '分數乘法練習卷一張',
  },
];
