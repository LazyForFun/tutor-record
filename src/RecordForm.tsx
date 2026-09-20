import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { DateField } from './DateField';
import { WEEKDAYS } from './lessonSchedule';
import type { RecordFields } from './types';

type Props = {
  title: string;
  initial: RecordFields;
  onSave: (data: RecordFields) => void;
  onCancel: () => void;
};

export const emptyFields: RecordFields = {
  studentName: '',
  lessonWeekdays: [],
  nextLessonAt: null,
  skipNext: false,
  progress: '',
  condition: '',
  nextPaymentAt: null,
  paid: false,
  homework: '',
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

const toDate = (iso: string | null) => (iso ? new Date(iso) : null);

/** Form for one student, used for both add and edit. Mount it fresh each time: state is seeded from `initial` once. */
export function RecordForm({ title, initial, onSave, onCancel }: Props) {
  const [studentName, setStudentName] = useState(initial.studentName);
  const [lessonWeekdays, setLessonWeekdays] = useState(initial.lessonWeekdays);
  const [nextLessonAt, setNextLessonAt] = useState(toDate(initial.nextLessonAt));
  const [skipNext, setSkipNext] = useState(initial.skipNext);
  const [progress, setProgress] = useState(initial.progress);
  const [condition, setCondition] = useState(initial.condition);
  const [nextPaymentAt, setNextPaymentAt] = useState(toDate(initial.nextPaymentAt));
  const [paid, setPaid] = useState(initial.paid);
  const [homework, setHomework] = useState(initial.homework);

  const canSave = studentName.trim().length > 0;

  // A new payment date means a new payment is due, so it starts out unpaid
  const handlePaymentDateChange = (date: Date | null) => {
    setNextPaymentAt(date);
    setPaid(false);
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      studentName: studentName.trim(),
      lessonWeekdays,
      nextLessonAt: nextLessonAt ? nextLessonAt.toISOString() : null,
      // Skipping only makes sense while lessons roll over by fixed day, which is what clears it
      skipNext: lessonWeekdays.length > 0 && skipNext,
      progress: progress.trim(),
      condition: condition.trim(),
      nextPaymentAt: nextPaymentAt ? nextPaymentAt.toISOString() : null,
      paid,
      homework: homework.trim(),
    });
  };

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}>
        <TextField label="學生姓名" value={studentName} onChangeText={setStudentName} />
        <View style={styles.field}>
          <Text style={styles.label}>固定上課日（每週，可複選）</Text>
          <View style={styles.weekdays}>
            {WEEKDAYS.map(({ value, label }) => {
              const selected = lessonWeekdays.includes(value);
              return (
                <Pressable
                  key={value}
                  style={[styles.weekday, selected && styles.weekdaySelected]}
                  onPress={() =>
                    setLessonWeekdays((prev) =>
                      selected ? prev.filter((d) => d !== value) : [...prev, value],
                    )
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`週${label}`}
                >
                  <Text style={[styles.weekdayText, selected && styles.weekdayTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <DateField
          label="下次上課時間"
          mode="datetime"
          value={nextLessonAt}
          onChange={setNextLessonAt}
        />
        {lessonWeekdays.length > 0 && (
          <View style={[styles.field, styles.switchRow]}>
            <Text style={styles.switchLabel}>下次停課</Text>
            <Switch value={skipNext} onValueChange={setSkipNext} />
          </View>
        )}
        <TextField label="上課進度" value={progress} onChangeText={setProgress} multiline />
        <TextField label="上課狀況" value={condition} onChangeText={setCondition} multiline />
        <DateField
          label="下次收費時間"
          mode="date"
          value={nextPaymentAt}
          onChange={handlePaymentDateChange}
        />
        <View style={[styles.field, styles.switchRow]}>
          <Text style={styles.switchLabel}>已收費</Text>
          <Switch value={paid} onValueChange={setPaid} />
        </View>
        <TextField label="作業內容" value={homework} onChangeText={setHomework} multiline />
      </ScrollView>
      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.cancel, pressed && styles.pressed]}
          onPress={onCancel}
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
    </>
  );
}

const styles = StyleSheet.create({
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: '#111',
  },
  weekdays: {
    flexDirection: 'row',
    gap: 6,
  },
  weekday: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  weekdaySelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  weekdayText: {
    fontSize: 16,
    color: '#111',
  },
  weekdayTextSelected: {
    color: '#fff',
    fontWeight: '600',
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
