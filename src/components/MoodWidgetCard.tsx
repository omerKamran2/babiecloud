// src/components/MoodWidgetCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mood } from '../services/moods';
import AddMoodModal from '../screens/AddMoodModal';

interface Props {
  latestMood?: Mood | null;
  onLongPress?: () => void;
}

const moodMap: Record<string, string> = {
  happy: '😊', ok: '😐', sad: '😢', tired: '😴', stressed: '😣',
};

const MoodWidgetCard: React.FC<Props> = ({ latestMood, onLongPress }) => {
  const nav = useNavigation();
  const scheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);

  if (latestMood === undefined) {
    return <View style={[styles.card, styles.skeleton]} />;
  }

  const isEmpty = latestMood === null;
  const emoji = !isEmpty
    ? moodMap[latestMood.mood] || '🙂'
    : null;

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: scheme === 'dark' ? '#222' : '#fafafa' }]}
        onPress={() => nav.navigate('Mood' as never)}
        onLongPress={isEmpty ? () => setShowModal(true) : onLongPress}
        accessibilityRole="button"
        accessibilityLabel="Open mood log"
      >
        {isEmpty ? (
          <Text style={[styles.text, styles.empty]}>Tap to log how you feel.</Text>
        ) : (
          <>
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>⚡ {latestMood.energy}</Text>
              <Text style={styles.stat}>💧 {latestMood.hydration}</Text>
            </View>
          </>
        )}
      </TouchableOpacity>
      <AddMoodModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default MoodWidgetCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emoji: { fontSize: 36 },
  text: { fontSize: 14, color: '#333' },
  empty: { textAlign: 'center' },
  stats: { flexDirection: 'row', marginTop: 8 },
  stat: { marginHorizontal: 8, fontSize: 12, color: '#666' },
  skeleton: {
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 20,
    margin: 8,
  },
});