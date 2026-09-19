import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DateField } from './DateField';
import type { TutorRecord } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (record: Omit<TutorRecord, 'id'>) => void;
};

function TextField({
  label,
  value,
  onChangeText,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export function AddRecordModal({ visible, onClose, onSave }: Props) {
  const [studentName, setStudentName] = useState('');
  const [nextLessonAt, setNextLessonAt] = useState(() => new Date());
  const [progress, setProgress] = useState('');
  const [condition, setCondition] = useState('');
  const [nextPaymentAt, setNextPaymentAt] = useState(() => new Date());
  const [homework, setHomework] = useState('');

  const reset = () => {
    setStudentName('');
    setNextLessonAt(new Date());
    setProgress('');
    setCondition('');
    setNextPaymentAt(new Date());
    setHomework('');
  };

  const canSave = studentName.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      studentName: studentName.trim(),
      nextLessonAt: nextLessonAt.toISOString(),
      progress: progress.trim(),
      condition: condition.trim(),
      nextPaymentAt: nextPaymentAt.toISOString(),
      homework: homework.trim(),
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>新增紀錄</Text>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
            <TextField label="學生姓名" value={studentName} onChangeText={setStudentName} />
            <DateField
              label="下次上課時間"
              mode="datetime"
              value={nextLessonAt}
              onChange={setNextLessonAt}
            />
            <TextField label="上課進度" value={progress} onChangeText={setProgress} multiline />
            <TextField label="上課狀況" value={condition} onChangeText={setCondition} multiline />
            <DateField
              label="下次收費時間"
              mode="date"
              value={nextPaymentAt}
              onChange={setNextPaymentAt}
            />
            <TextField label="作業內容" value={homework} onChangeText={setHomework} multiline />
          </ScrollView>
          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.button, styles.cancel, pressed && styles.pressed]}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>取消</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.save,
                !canSave && styles.disabled,
                pressed && styles.pressed,
              ]}
              disabled={!canSave}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>儲存</Text>
            </Pressable>
          </View>
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
  title: {
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
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  multiline: {
    minHeight: 72,
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
  cancel: {
    backgroundColor: '#e5e7eb',
  },
  cancelText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
  save: {
    backgroundColor: '#2563eb',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
});
