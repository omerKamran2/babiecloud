// src/services/weather.ts
import { useState, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Get API key from .env
const API_KEY = process.env.OWM_API_KEY;

export interface WeatherData {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  };
  daily: {
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  timestamp: number; // When the data was fetched
  locationPermissionGranted: boolean;
}

/**
 * Fetches weather data from OpenWeatherMap API
 */
export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get city name from coordinates using reverse geocoding
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    const geoData = await geoResponse.json();
    const locationName = geoData[0]?.name || 'Unknown Location';
    
    return {
      location: {
        lat,
        lon,
        name: locationName,
      },
      current: data.current,
      daily: data.daily,
      timestamp: Date.now(),
      locationPermissionGranted: true,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

/**
 * Hook to get and manage weather data
 * - Gets location permission
 * - Fetches weather data
 * - Caches data for 30 minutes
 */
export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we need to refresh weather data (30 min cache)
  const shouldRefresh = () => {
    if (!weather) return true;
    const thirtyMinutesInMs = 30 * 60 * 1000;
    return Date.now() - weather.timestamp > thirtyMinutesInMs;
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        return true;
      }
      
      setWeather(prev => prev 
        ? { ...prev, locationPermissionGranted: false }
        : { 
            location: { lat: 0, lon: 0, name: '' },
            current: { temp: 0, feels_like: 0, humidity: 0, wind_speed: 0, weather: [] },
            daily: [],
            timestamp: Date.now(),
            locationPermissionGranted: false
          }
      );
      setError('Location permission denied');
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Error requesting location permission');
      setLoading(false);
      return false;
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Check permission first
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      
      const permissionResult = await check(permission);
      
      if (permissionResult !== RESULTS.GRANTED) {
        const granted = await requestLocationPermission();
        if (!granted) return;
      }
      
      // Get current position
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const weatherData = await getWeather(latitude, longitude);
          
          if (weatherData) {
            setWeather(weatherData);
            setError(null);
          } else {
            setError('Failed to fetch weather data');
          }
          
          setLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(`Geolocation error: ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.error('Error in fetchWeatherData:', err);
      setError('An error occurred while fetching weather data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldRefresh()) {
      fetchWeatherData();
    }
  }, []);

  return {
    weather,
    loading,
    error,
    refresh: fetchWeatherData,
  };
};

/**
 * Opens the system weather app
 */
export const openSystemWeatherApp = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('weather://');
  } else {
    // On Android, try to open a common weather app or fallback to web
    Linking.canOpenURL('com.google.android.apps.weather').then(supported => {
      if (supported) {
        Linking.openURL('com.google.android.apps.weather');
      } else {
        // Fallback to OpenWeatherMap website
        Linking.openURL('https://openweathermap.org/');
      }
    });
  }
};
