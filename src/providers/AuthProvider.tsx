// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import firestore from '@react-native-firebase/firestore';

interface AuthContextProps {
  user: AuthUser | null;
  profile: Record<string, any> | null;
}
const AuthContext = createContext<AuthContextProps>({ user: null, profile: null });

interface AuthProviderProps { children: React.ReactNode; }
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async u => {
      setUser(u);
      if (u?.email) {
        try {
          const q = firestore().collection('users').where('email', '==', u.email).limit(1);
          const snap = await q.get();
          setProfile(!snap.empty ? snap.docs[0].data() : null);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
