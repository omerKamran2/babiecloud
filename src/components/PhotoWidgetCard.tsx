// src/components/PhotoWidgetCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  useColorScheme, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WidgetContentDoc } from '../services/widgetContent';

interface PhotoWidgetCardProps {
  photo?: WidgetContentDoc | null;
  onLongPress?: () => void;
}

const PhotoWidgetCard: React.FC<PhotoWidgetCardProps> = ({ photo, onLongPress }) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  
  // Calculate time difference
  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const photoTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffMs = now.getTime() - photoTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} d ago`;
    }
  };
  
  const handlePress = () => {
    // @ts-ignore - We'll assume the navigation types will be fixed later
    navigation.navigate('Inbox');
  };
  
  if (!photo) {
    // Skeleton loading state
    return (
      <TouchableOpacity 
        style={styles.container} 
        onLongPress={onLongPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Loading photo widget"
      >
        <View style={[styles.imageContainer, { backgroundColor: isDark ? '#222' : '#e0e0e0' }]} />
        <View style={styles.captionContainer}>
          <View style={[styles.captionSkeleton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />
          <View style={[styles.timeSkeleton, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={photo.title ? `Photo: ${photo.title}` : "Partner photo"}
    >
      <Image 
        source={{ uri: photo.imageUrl }}
        style={styles.imageContainer}
        resizeMode="cover"
      />
      <View style={styles.captionContainer}>
        <Text 
          style={[styles.caption, { color: isDark ? '#fff' : '#000' }]}
          numberOfLines={1}
        >
          {photo.title || 'New photo from partner'}
        </Text>
        <Text style={[styles.timestamp, { color: isDark ? '#aaa' : '#666' }]}>
          Sent {getTimeAgo(photo.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    marginBottom: 8,
  },
  captionContainer: {
    paddingHorizontal: 4,
  },
  caption: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  captionSkeleton: {
    height: 16,
    width: '70%',
    borderRadius: 4,
    marginBottom: 6,
  },
  timeSkeleton: {
    height: 12,
    width: '40%',
    borderRadius: 4,
  }
});

export default PhotoWidgetCard;
