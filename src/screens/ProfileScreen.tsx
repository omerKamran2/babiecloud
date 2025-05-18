// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { signOut } from '../services/auth';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const scheme = useColorScheme();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#000' : '#fff' }]}>      
      <Text style={[styles.label, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Email</Text>
      <Text style={[styles.value, { color: scheme === 'dark' ? '#fff' : '#000' }]}>{user?.email}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}
        onPress={handleSignOut}
        accessibilityLabel="Sign Out Button"
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
