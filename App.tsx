import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/providers/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}