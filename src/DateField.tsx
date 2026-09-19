import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDate, formatDateTime } from './formatDate';

type Props = {
  label: string;
  value: Date;
  /** 'datetime' picks date + time, 'date' picks the date only */
  mode: 'date' | 'datetime';
  onChange: (date: Date) => void;
};

export function DateField({ label, value, mode, onChange }: Props) {
  // Android has no combined picker: pick the date first, then the time.
  const openAndroid = () => {
    DateTimePickerAndroid.open({
      value,
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

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'ios' ? (
        <View style={styles.iosPicker}>
          <DateTimePicker
            value={value}
            mode={mode}
            display="compact"
            locale="zh-TW"
            onValueChange={(_e, date) => onChange(date)}
          />
        </View>
      ) : (
        <Pressable style={styles.androidButton} onPress={openAndroid}>
          <Text style={styles.androidText}>
            {mode === 'date' ? formatDate(value.toISOString()) : formatDateTime(value.toISOString())}
          </Text>
        </Pressable>
      )}
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
  iosPicker: {
    alignItems: 'flex-start',
  },
  androidButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  androidText: {
    fontSize: 16,
    color: '#111',
  },
});
