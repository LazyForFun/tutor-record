import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import type { TutorRecord } from './types';

const STORAGE_KEY = 'tutor-record:records';

async function loadRecords(): Promise<TutorRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TutorRecord[]) : [];
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

  const addRecord = useCallback((data: Omit<TutorRecord, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setRecords((prev) => [{ id, ...data }, ...prev]);
  }, []);

  const removeRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, loaded, addRecord, removeRecord };
}
