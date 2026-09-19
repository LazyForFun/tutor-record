import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { emptyFields, RecordForm } from './RecordForm';
import type { RecordFields } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: RecordFields) => void;
};

export function AddStudentModal({ visible, onClose, onAdd }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Backdrop taps are ignored so a half-filled form isn't lost by accident */}
        <Pressable style={StyleSheet.absoluteFill} />
        <View style={styles.card}>
          {/* Only mounted while visible, so every open starts with a blank form */}
          {visible && (
            <RecordForm title="新增學生" initial={emptyFields} onSave={onAdd} onCancel={onClose} />
          )}
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
});
