import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AddRecordModal } from './src/AddRecordModal';
import { formatDateTime } from './src/formatDate';
import { RecordDetailModal } from './src/RecordDetailModal';
import type { TutorRecord } from './src/types';
import { useRecords } from './src/useRecords';

export default function App() {
  const { records, loaded, addRecord, removeRecord } = useRecords();
  const [selected, setSelected] = useState<TutorRecord | null>(null);
  const [adding, setAdding] = useState(false);

  const handleSave = (data: Omit<TutorRecord, 'id'>) => {
    addRecord(data);
    setAdding(false);
  };

  const confirmDelete = (record: TutorRecord) => {
    Alert.alert(record.studentName, undefined, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: () => removeRecord(record.id),
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Absolute children ignore SafeAreaView's padding, so the FAB lives in
            this inner View to be positioned inside the safe area. */}
        <View style={styles.content}>
          <Text style={styles.title}>上課紀錄</Text>
          <FlatList
            data={records}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              loaded ? <Text style={styles.empty}>目前沒有紀錄，點右下角 + 新增</Text> : null
            }
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}
                onPress={() => setSelected(item)}
                onLongPress={() => confirmDelete(item)}
              >
                <Text style={styles.name}>{item.studentName}</Text>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>下次上課</Text>
                  <Text style={styles.rowValue}>{formatDateTime(item.nextLessonAt)}</Text>
                </View>
              </Pressable>
            )}
          />
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
            onPress={() => setAdding(true)}
            accessibilityRole="button"
            accessibilityLabel="新增紀錄"
          >
            <Text style={styles.fabText}>+</Text>
          </Pressable>
        </View>
        <RecordDetailModal record={selected} onClose={() => setSelected(null)} />
        <AddRecordModal visible={adding} onClose={() => setAdding(false)} onSave={handleSave} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 96, // keep the last item clear of the + button
    gap: 12,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  rowValue: {
    fontSize: 14,
    color: '#111',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '400',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
  },
});
