// src/navigation/AppTabs.tsx
import React from 'react';
import { useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import MoodScreen from '../screens/MoodScreen';
// import InboxScreen from '../screens/InboxScreen';

export type AppTabParamList = {
  Profile: undefined;
  Home: undefined;
  Tasks: undefined;
  Mood: undefined;
  Inbox: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppTabs: React.FC = () => {
  const scheme = useColorScheme();
  const tintColor = scheme === 'dark' ? '#fff' : '#007aff';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'ellipse';
          if (route.name === 'Profile') iconName = 'person-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Tasks') iconName = 'clipboard-outline';
          if (route.name === 'Mood') iconName = 'heart-outline';
          if (route.name === 'Inbox') iconName = 'mail-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Tab.Screen name="Inbox" component={InboxScreen} /> */}
    </Tab.Navigator>
  );
};

export default AppTabs;
