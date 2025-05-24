// src/components/WeatherWidgetCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  useColorScheme, 
  TouchableOpacity, 
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData, openSystemWeatherApp } from '../services/weather';

interface WeatherWidgetCardProps {
  weather?: WeatherData | null;
  onLongPress?: () => void;
}

const WeatherWidgetCard: React.FC<WeatherWidgetCardProps> = ({ weather, onLongPress }) => {
  const isDark = useColorScheme() === 'dark';
  
  // Get weather icon URL
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  // No location permission granted
  if (weather && !weather.locationPermissionGranted) {
    return (
      <TouchableOpacity 
        style={styles.container} 
        onLongPress={onLongPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Enable location to see weather"
      >
        <View style={styles.permissionContainer}>
          <Ionicons 
            name="location-outline" 
            size={34} 
            color={isDark ? '#aaa' : '#666'} 
            style={{ marginBottom: 12 }}
          />
          <Text style={[styles.permissionText, { color: isDark ? '#fff' : '#000' }]}>
            Turn on location for weather 😊
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Loading state
  if (!weather || !weather.current) {
    return (
      <TouchableOpacity 
        style={styles.container} 
        onLongPress={onLongPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Loading weather information"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#1e90ff' : '#007aff'} />
          <Text style={[styles.loadingText, { color: isDark ? '#aaa' : '#666' }]}>
            Loading weather...
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  const { current, location } = weather;
  const weatherCondition = current.weather[0];
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={openSystemWeatherApp}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Weather in ${location.name}: ${Math.round(current.temp)}°C, ${weatherCondition.description}`}
    >
      <View style={styles.headerRow}>
        <Ionicons 
          name="location" 
          size={16} 
          color={isDark ? '#aaa' : '#666'} 
          style={{ marginRight: 4 }}
        />
        <Text style={[styles.locationText, { color: isDark ? '#fff' : '#000' }]}>
          {location.name}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.tempContainer}>
          <Text style={[styles.tempText, { color: isDark ? '#fff' : '#000' }]}>
            {Math.round(current.temp)}°
          </Text>
          <Text style={[styles.feelsLikeText, { color: isDark ? '#aaa' : '#666' }]}>
            Feels like {Math.round(current.feels_like)}°
          </Text>
        </View>
        
        <View style={styles.iconContainer}>
          <Image 
            source={{ uri: getWeatherIcon(weatherCondition.icon) }}
            style={styles.weatherIcon}
          />
          <Text style={[styles.conditionText, { color: isDark ? '#fff' : '#000' }]}>
            {weatherCondition.main}
          </Text>
        </View>
      </View>
      
      <View style={styles.footerRow}>
        <Text style={[styles.detailText, { color: isDark ? '#aaa' : '#666' }]}>
          Humidity: {current.humidity}%
        </Text>
        <Text style={[styles.detailText, { color: isDark ? '#aaa' : '#666' }]}>
          Wind: {Math.round(current.wind_speed * 3.6)} km/h
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  tempContainer: {
    flex: 1,
  },
  tempText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  feelsLikeText: {
    fontSize: 14,
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default WeatherWidgetCard;
