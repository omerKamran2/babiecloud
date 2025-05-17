import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ControlledInput from '../components/ControlledInput';
import { addTask } from '../services/tasks';
import { useAuth } from '../providers/AuthProvider';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  dueDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .required('Due date is required'),
  description: yup.string().optional(),
});

// infer FormData type directly from the Yup schema
type FormData = yup.InferType<typeof schema>;

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<Props> = ({ visible, onClose }) => {
  // Use any-cast resolver to satisfy TypeScript generics
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const scheme = useColorScheme();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user) return;
    setLoading(true);
    try {
      await addTask(user.uid, data);
      reset();
      onClose();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={[styles.overlay, { backgroundColor: scheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>  
        <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#333' : '#fff' }]}>          
          <Text style={[styles.title, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Add New Task</Text>
          <ControlledInput control={control} name="title" placeholder="Title" />
          <ControlledInput control={control} name="description" placeholder="Description" />
          <ControlledInput control={control} name="dueDate" placeholder="YYYY-MM-DD" />
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddTaskModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', padding: 16, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  button: { paddingVertical: 12, borderRadius: 4, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  closeButton: { marginTop: 8, alignItems: 'center' },
  closeText: { fontWeight: 'bold' },
});
