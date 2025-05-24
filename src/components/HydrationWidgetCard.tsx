// src/components/HydrationWidgetCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HydrationWidgetCardProps {
  onLongPress?: () => void;
}

const HydrationWidgetCard: React.FC<HydrationWidgetCardProps> = ({ onLongPress }) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  
  const handlePress = () => {
    // @ts-ignore - We'll assume the navigation types will be fixed later
    navigation.navigate('Hydration');
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Log water intake"
    >
      <View style={styles.contentContainer}>
        <Ionicons 
          name="water" 
          size={48} 
          color={isDark ? '#1e90ff' : '#007aff'} 
          style={styles.icon}
        />
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          💧 Log water intake
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#aaa' : '#666' }]}>
          Tap to track your hydration
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  }
});

export default HydrationWidgetCard;
