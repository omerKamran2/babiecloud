// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const HomeScreen: React.FC = () => {
  const scheme = useColorScheme();
  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#000' : '#fff' }]}>      
      <Text style={[styles.text, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Home Screen Placeholder</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
