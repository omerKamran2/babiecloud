// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAuth } from '../providers/AuthProvider';
import { listenToTasks, Task } from '../services/tasks';
import { listenToMoods, Mood } from '../services/moods';
import TaskWidgetCard from '../components/TaskWidgetCard';
import MoodWidgetCard from '../components/MoodWidgetCard';
import { useWidgetOrder } from '../hooks/useWidgetOrder';

type WidgetId = 'tasks' | 'moods';
type WidgetItem = { id: WidgetId };

const DEFAULT_ORDER: WidgetId[] = ['tasks', 'moods'];

const AnimatedCard: React.FC<{ isActive: boolean; bg: string; children: React.ReactNode }> = ({ isActive, bg, children }) => {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withTiming(isActive ? 1.05 : 1, { duration: 150 });
  }, [isActive]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[styles.card, { backgroundColor: bg }, style]}>{children}</Animated.View>;
};

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const scheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>();
  const [moods, setMoods] = useState<Mood[]>();
  const [order, setOrder] = useWidgetOrder(user!.uid);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubT = listenToTasks(user.uid, setTasks);
    const unsubM = listenToMoods(user.uid, setMoods);
    return () => { unsubT(); unsubM(); };
  }, [user]);

  const items = (order.length ? order : DEFAULT_ORDER).map(id => ({ id }));

  const latestMood = moods === undefined
    ? undefined
    : moods.length > 0
      ? moods[0]
      : null;

  const renderItem = ({ item, drag, isActive }: RenderItemParams<WidgetItem>) => (
    <View style={{ flex: 1 }}>
      <AnimatedCard isActive={isActive} bg={scheme === 'dark' ? '#333' : '#fff'}>
        {item.id === 'tasks' ? (
          <TaskWidgetCard tasks={tasks} onLongPress={drag} />
        ) : (
          <MoodWidgetCard latestMood={latestMood} onLongPress={drag} />
        )}
      </AnimatedCard>
    </View>
  );

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setOrder(data.map(d => d.id))}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 8 },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});