import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatDate, formatDateTime } from './formatDate';
import type { TutorRecord } from './types';

type Props = {
  record: TutorRecord | null;
  onClose: () => void;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function RecordDetailModal({ record, onClose }: Props) {
  return (
    <Modal
      visible={record !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable swallows taps so touching the card doesn't close it */}
        <Pressable style={styles.card} onPress={() => {}}>
          {record && (
            <>
              <Text style={styles.name}>{record.studentName}</Text>
              <ScrollView style={styles.scroll}>
                <Field label="下次上課時間" value={formatDateTime(record.nextLessonAt)} />
                <Field label="上課進度" value={record.progress} />
                <Field label="上課狀況" value={record.condition} />
                <Field label="下次收費時間" value={formatDate(record.nextPaymentAt)} />
                <Field label="作業內容" value={record.homework} />
              </ScrollView>
              <Pressable
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                onPress={onClose}
              >
                <Text style={styles.closeText}>關閉</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  scroll: {
    flexGrow: 0,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#111',
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
