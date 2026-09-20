import type { TutorRecord } from './types';

/** Weekday picker options, Monday first. `value` follows Date#getDay (0 = Sunday). */
export const WEEKDAYS = [
  { value: 1, label: '一' },
  { value: 2, label: '二' },
  { value: 3, label: '三' },
  { value: 4, label: '四' },
  { value: 5, label: '五' },
  { value: 6, label: '六' },
  { value: 0, label: '日' },
] as const;

/** e.g. "週一、週三", in Monday-first order */
export const formatWeekdays = (weekdays: number[]) =>
  WEEKDAYS.filter((w) => weekdays.includes(w.value))
    .map((w) => `週${w.label}`)
    .join('、');

/** The first moment after `now` that falls on any of `weekdays`, at the same time of day as `timeOfDay`. */
function nextOccurrence(now: Date, weekdays: number[], timeOfDay: Date): Date {
  const candidates = weekdays.map((weekday) => {
    const next = new Date(now);
    next.setHours(timeOfDay.getHours(), timeOfDay.getMinutes(), 0, 0);
    next.setDate(next.getDate() + ((weekday - next.getDay() + 7) % 7));
    if (next <= now) next.setDate(next.getDate() + 7);
    return next;
  });
  return candidates.reduce((earliest, d) => (d < earliest ? d : earliest));
}

/**
 * Keep a student's next lesson in step with their fixed lesson days: once it is over, move it
 * to the next fixed lesson day; if it was never set, start it at the nearest fixed lesson day
 * (with no time to copy, the current time of day is used).
 * Returns the same object when nothing needs to change, so callers can skip state updates.
 */
export function advanceLesson(record: TutorRecord, now: Date): TutorRecord {
  if (record.lessonWeekdays.length === 0) return record;
  const current = record.nextLessonAt === null ? now : new Date(record.nextLessonAt);
  if (record.nextLessonAt !== null && current > now) return record;
  const next = nextOccurrence(now, record.lessonWeekdays, current);
  return { ...record, nextLessonAt: next.toISOString() };
}
