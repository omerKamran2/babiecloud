// src/components/TaskWidgetCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Task } from '../services/tasks';
import { format } from 'date-fns';

interface Props {
  tasks?: Task[];
  onLongPress?: () => void;
}

const TaskWidgetCard: React.FC<Props> = ({ tasks, onLongPress }) => {
  const nav = useNavigation();
  const scheme = useColorScheme();

  if (!tasks) {
    return <View style={[styles.card, styles.skeleton]} />;
  }

  const incomplete = tasks.filter(t => !t.isCompleted);
  const nextDue = incomplete.sort(
    (a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime()
  )[0];

  const onPress = () => nav.navigate('Tasks' as never);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: scheme === 'dark' ? '#222' : '#fafafa' }]}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel="Open tasks"
    >
      {incomplete.length === 0 ? (
        <Text style={[styles.text, styles.empty]}>All done! 🎉</Text>
      ) : (
        <>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{incomplete.length}</Text>
          </View>
          {nextDue && (
            <Text style={styles.subtitle}>
              Next: {nextDue.title} ({format(nextDue.dueDate.toDate(), 'EEE, d MMM')})
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default TaskWidgetCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  text: { fontSize: 14, color: '#333' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  pill: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pillText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center' },
  skeleton: {
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 20,
    margin: 8,
  },
});