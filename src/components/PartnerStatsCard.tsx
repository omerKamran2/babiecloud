// src/components/PartnerStatsCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PartnerSummary } from '../services/supportPartners';
import { format } from 'date-fns';

interface Props {
  partner: PartnerSummary;
  onPress?: () => void;
}

const moodEmojis: Record<string, string> = {
  happy: '😊', 
  ok: '😐', 
  sad: '😢', 
  tired: '😴', 
  stressed: '😣',
};

const PartnerStatsCard: React.FC<Props> = ({ partner, onPress }) => {
  const scheme = useColorScheme();
  const backgroundColor = scheme === 'dark' ? '#333' : '#fff';
  const textColor = scheme === 'dark' ? '#fff' : '#000';
  
  // Calculate task completion percentage
  const completionPercentage = partner.taskCount.total > 0 
    ? Math.round((partner.taskCount.completed / partner.taskCount.total) * 100) 
    : 0;
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      accessibilityLabel={`Partner stats for ${partner.name}`}
    >
      <Text style={[styles.name, { color: textColor }]}>{partner.name}</Text>
      <Text style={[styles.email, { color: textColor }]}>{partner.email}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Tasks</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {partner.taskCount.completed}/{partner.taskCount.total} ({completionPercentage}%)
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Moods</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            {partner.moodCount}
          </Text>
        </View>
      </View>
      
      {partner.lastMood ? (
        <View style={styles.moodContainer}>
          <Text style={styles.lastMoodLabel}>Last Mood:</Text>
          <Text style={styles.emoji}>
            {moodEmojis[partner.lastMood.mood]}
          </Text>
          <Text style={[styles.moodDate, { color: textColor }]}>
            {format(partner.lastMood.timestamp.toDate(), 'yyyy-MM-dd')}
          </Text>
        </View>
      ) : (
        <Text style={[styles.noData, { color: textColor }]}>No mood data</Text>
      )}
    </TouchableOpacity>
  );
};

export default PartnerStatsCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lastMoodLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodDate: {
    fontSize: 12,
  },
  noData: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.6,
  },
});
