import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { advanceLesson } from './lessonSchedule';
import type { RecordFields, TutorRecord } from './types';

const STORAGE_KEY = 'tutor-record:records';

async function loadRecords(): Promise<TutorRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Older records may lack `paid` / `lessonWeekdays` (or hold the single-day `lessonWeekday`):
    // treat them as unpaid / carry the day over
    return (parsed as (TutorRecord & { lessonWeekday?: number | null })[]).map(
      ({ lessonWeekday, ...r }) => ({
        ...r,
        paid: r.paid === true,
        lessonWeekdays: Array.isArray(r.lessonWeekdays)
          ? r.lessonWeekdays
          : typeof lessonWeekday === 'number'
            ? [lessonWeekday]
            : [],
      }),
    );
  } catch {
    return [];
  }
}

export function useRecords() {
  const [records, setRecords] = useState<TutorRecord[]>([]);
  // Saving is held back until the initial load finishes, otherwise the empty
  // starting state would overwrite what is on disk.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadRecords().then((stored) => {
      if (cancelled) return;
      setRecords(stored);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Move lessons that are over to the next fixed lesson day. Checked when the app
  // comes back to the foreground and once a minute while it is open.
  useEffect(() => {
    if (!loaded) return;
    const rollOver = () =>
      setRecords((prev) => {
        const now = new Date();
        const next = prev.map((r) => advanceLesson(r, now));
        // Keep the old array when nothing moved, so no re-render or save happens
        return next.some((r, i) => r !== prev[i]) ? next : prev;
      });
    rollOver();
    const timer = setInterval(rollOver, 60_000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') rollOver();
    });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records)).catch((e) =>
      console.warn('Failed to save records', e),
    );
  }, [records, loaded]);

  const addStudent = useCallback((data: RecordFields) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setRecords((prev) => [advanceLesson({ id, ...data }, new Date()), ...prev]);
  }, []);

  const updateRecord = useCallback((id: string, data: RecordFields) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? advanceLesson({ id, ...data }, new Date()) : r)));
  }, []);

  const removeRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loaded, addStudent, updateRecord, removeRecord };
}
