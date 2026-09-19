import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { RecordFields, TutorRecord } from './types';

const STORAGE_KEY = 'tutor-record:records';

async function loadRecords(): Promise<TutorRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Records saved before `paid` existed have no such field: treat them as unpaid
    return (parsed as TutorRecord[]).map((r) => ({ ...r, paid: r.paid === true }));
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

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records)).catch((e) =>
      console.warn('Failed to save records', e),
    );
  }, [records, loaded]);

  const addStudent = useCallback((data: RecordFields) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setRecords((prev) => [{ id, ...data }, ...prev]);
  }, []);

  const updateRecord = useCallback((id: string, data: RecordFields) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { id, ...data } : r)));
  }, []);

  const removeRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loaded, addStudent, updateRecord, removeRecord };
}
