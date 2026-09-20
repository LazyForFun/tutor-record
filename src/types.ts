export type TutorRecord = {
  id: string;
  studentName: string;
  /** ISO 8601 datetime of the next lesson, null until set */
  nextLessonAt: string | null;
  /** 固定每週上課日, Date#getDay style (0 = Sunday .. 6 = Saturday), empty when not fixed */
  lessonWeekdays: number[];
  /** 下次停課: the upcoming lesson is cancelled; cleared when it rolls over to the next fixed day */
  skipNext: boolean;
  /** 上課進度 */
  progress: string;
  /** 上課狀況 */
  condition: string;
  /** ISO 8601 datetime of the next payment, null until set */
  nextPaymentAt: string | null;
  /** 已收費: whether the payment for `nextPaymentAt` has been received */
  paid: boolean;
  /** 作業內容 */
  homework: string;
};

/** Everything about a student except the id, i.e. what the edit form produces. */
export type RecordFields = Omit<TutorRecord, 'id'>;
