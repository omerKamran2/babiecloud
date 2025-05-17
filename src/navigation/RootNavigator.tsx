// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const RootNavigator: React.FC = () => {
  const { user } = useAuth();
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
