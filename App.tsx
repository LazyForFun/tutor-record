import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { formatDateTime } from './src/formatDate';
import { RecordDetailModal } from './src/RecordDetailModal';
import { sampleRecords } from './src/sampleRecords';
import type { TutorRecord } from './src/types';

export default function App() {
  const [records] = useState<TutorRecord[]>(sampleRecords);
  const [selected, setSelected] = useState<TutorRecord | null>(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>上課紀錄</Text>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>目前沒有紀錄</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              onPress={() => setSelected(item)}
            >
              <Text style={styles.name}>{item.studentName}</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>下次上課</Text>
                <Text style={styles.rowValue}>{formatDateTime(item.nextLessonAt)}</Text>
              </View>
            </Pressable>
          )}
        />
        <RecordDetailModal record={selected} onClose={() => setSelected(null)} />
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
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
  },
});
