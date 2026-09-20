import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { formatDate, formatDateTime } from './formatDate';
import { formatWeekdays } from './lessonSchedule';
import { RecordForm } from './RecordForm';
import type { RecordFields, TutorRecord } from './types';

type Props = {
  record: TutorRecord | null;
  onClose: () => void;
  onUpdate: (id: string, data: RecordFields) => void;
};

const UNSET = '尚未設定';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function RecordDetailModal({ record, onClose, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  const close = () => {
    setEditing(false);
    onClose();
  };

  return (
    <Modal
      visible={record !== null}
      transparent
      animationType="fade"
      // Back while editing returns to the detail view instead of closing everything
      onRequestClose={editing ? () => setEditing(false) : close}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Tapping outside closes the popup, except while editing so edits aren't lost by accident */}
        <Pressable style={StyleSheet.absoluteFill} onPress={editing ? undefined : close} />
        <View style={styles.card}>
          {record &&
            (editing ? (
              <RecordForm
                title="編輯資料"
                initial={record}
                onCancel={() => setEditing(false)}
                onSave={(data) => {
                  onUpdate(record.id, data);
                  setEditing(false);
                }}
              />
            ) : (
              <>
                <Text style={styles.name}>{record.studentName}</Text>
                <ScrollView style={styles.scroll}>
                  <Field
                    label="固定上課日"
                    value={record.lessonWeekdays.length > 0 ? `每${formatWeekdays(record.lessonWeekdays)}` : UNSET}
                  />
                  <Field
                    label="下次上課時間"
                    value={record.nextLessonAt ? formatDateTime(record.nextLessonAt) : UNSET}
                  />
                  {record.skipNext && <Field label="下次停課" value="是，當天不上課" />}
                  <Field label="上課進度" value={record.progress || UNSET} />
                  <Field label="上課狀況" value={record.condition || UNSET} />
                  <Field
                    label="下次收費時間"
                    value={record.nextPaymentAt ? formatDate(record.nextPaymentAt) : UNSET}
                  />
                  <Field label="收費狀態" value={record.paid ? '已收費' : '未收費'} />
                  <Field label="作業內容" value={record.homework || UNSET} />
                </ScrollView>
                <View style={styles.buttons}>
                  <Pressable
                    style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
                    onPress={close}
                  >
                    <Text style={styles.secondaryText}>關閉</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
                    onPress={() => setEditing(true)}
                  >
                    <Text style={styles.primaryText}>編輯</Text>
                  </Pressable>
                </View>
              </>
            ))}
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  secondaryText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
