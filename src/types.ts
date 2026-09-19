export type TutorRecord = {
  id: string;
  studentName: string;
  /** ISO 8601 datetime of the next lesson */
  nextLessonAt: string;
  /** 上課進度 */
  progress: string;
  /** 上課狀況 */
  condition: string;
  /** ISO 8601 datetime of the next payment */
  nextPaymentAt: string;
  /** 作業內容 */
  homework: string;
};
