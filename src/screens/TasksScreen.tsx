// src/screens/TasksScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listenToTasks, deleteTask, Task } from '../services/tasks';
import { useAuth } from '../providers/AuthProvider';
import { format } from 'date-fns';
import AddTaskModal from './AddTaskModal';

const TasksScreen: React.FC = () => {
  const scheme = useColorScheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToTasks(user.uid, newTasks => {
      setTasks(newTasks);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const handleDelete = (id: string) => {
    if (user) deleteTask(user.uid, id);
  };

  const renderRight = (id: string) => (
    <View style={styles.deleteContainer}>
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </View>
  );

  const renderItem = ({ item }: { item: Task }) => (
    <Swipeable
      renderRightActions={() => renderRight(item.id)}
      onSwipeableOpen={() => handleDelete(item.id)}
    >
      <View
        style={[
          styles.item,
          { backgroundColor: scheme === 'dark' ? '#333' : '#fff' },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          {format(item.dueDate.toDate(), 'yyyy-MM-dd')}
        </Text>
      </View>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={tasks}
        keyExtractor={t => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No tasks found.</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Add new task"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      <AddTaskModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  item: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 12,
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  date: { fontSize: 12, color: '#666' },
  deleteContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginBottom: 12,
    borderRadius: 4,
  },
  empty: { textAlign: 'center', marginTop: 32, color: '#666' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'blue',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
