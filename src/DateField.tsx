import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDate, formatDateTime } from './formatDate';

type Props = {
  label: string;
  /** null means "not set yet" */
  value: Date | null;
  /** 'datetime' picks date + time, 'date' picks the date only */
  mode: 'date' | 'datetime';
  onChange: (date: Date | null) => void;
};

export function DateField({ label, value, mode, onChange }: Props) {
  // Android has no combined picker: pick the date first, then the time.
  const openAndroid = () => {
    DateTimePickerAndroid.open({
      value: value ?? new Date(),
      mode: 'date',
      onValueChange: (_e, pickedDate) => {
        if (mode === 'date') {
          onChange(pickedDate);
          return;
        }
        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: 'time',
          is24Hour: true,
          onValueChange: (_e2, pickedTime) => onChange(pickedTime),
        });
      },
    });
  };

  const androidText = value
    ? mode === 'date'
      ? formatDate(value.toISOString())
      : formatDateTime(value.toISOString())
    : '尚未設定';

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {Platform.OS === 'ios' ? (
          value ? (
            <DateTimePicker
              value={value}
              mode={mode}
              display="compact"
              locale="zh-TW"
              onValueChange={(_e, date) => onChange(date)}
            />
          ) : (
            <Pressable style={styles.button} onPress={() => onChange(new Date())}>
              <Text style={styles.placeholder}>尚未設定，點此設定</Text>
            </Pressable>
          )
        ) : (
          <Pressable style={styles.button} onPress={openAndroid}>
            <Text style={value ? styles.buttonText : styles.placeholder}>{androidText}</Text>
          </Pressable>
        )}
        {value && (
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={styles.clear}>清除</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
  placeholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  clear: {
    fontSize: 14,
    color: '#dc2626',
  },
});
