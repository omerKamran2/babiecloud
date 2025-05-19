// src/screens/MoodScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { listenToMoods, Mood } from '../services/moods';
import { useAuth } from '../providers/AuthProvider';
import AddMoodModal from './AddMoodModal';
import { format } from 'date-fns';

const MoodScreen: React.FC = () => {
  const { user, profile } = useAuth();
  const scheme = useColorScheme();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = listenToMoods(user.uid, list => {
      setMoods(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (profile && profile.role !== 'partner') {
    return (
      <View style={styles.center}>
        <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>Access denied</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Mood }) => (
    <View style={[styles.item, { backgroundColor: scheme === 'dark' ? '#333' : '#fff' }]}>  
      <Text style={[styles.date, { color: scheme === 'dark' ? '#fff' : '#000' }]}>
        {item.timestamp ? format(item.timestamp.toDate(), 'yyyy-MM-dd') : ''}
      </Text>
      <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>Mood: {item.mood}</Text>
      <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>Energy: {item.energy}</Text>
      <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>Hydration: {item.hydration}</Text>
      {item.note ? <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>Note: {item.note}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {moods.length > 0 ? (
        <FlashList
          data={moods}
          renderItem={renderItem}
          estimatedItemSize={100}
          keyExtractor={i => i.id}
        />
      ) : (
        <View style={styles.center}>
          {/* <Image source={require('../../assets/no-data.png')} style={styles.image} /> */}
          <Text style={{ color: scheme === 'dark' ? '#fff' : '#000' }}>No moods logged yet.</Text>
        </View>
      )}
      {/* always allow logging additional moods */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Log Mood"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <AddMoodModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

export default MoodScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 16, margin: 8, borderRadius: 6, elevation: 1 },
  date: { fontWeight: 'bold', marginBottom: 4 },
  fab: { position: 'absolute', right: 16, bottom: 32, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  fabText: { fontSize: 32, color: '#fff', lineHeight: 32 },
  image: { width: 120, height: 120, marginBottom: 16 },
});
