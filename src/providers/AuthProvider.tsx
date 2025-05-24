// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';

interface AuthContextProps {
  user: AuthUser | null;
  profile: Record<string, any> | null;
  isLoading: boolean;
  error: string | null;
}

// Expanded context with isLoading and error states
const AuthContext = createContext<AuthContextProps>({ 
  user: null, 
  profile: null, 
  isLoading: false,
  error: null
});

interface AuthProviderProps { children: React.ReactNode; }
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let profileListener: (() => void) | undefined;
    
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async u => {
      setUser(u);
      console.log("Auth state changed, user:", u?.email);
      
      // Clean up previous listener if it exists
      if (profileListener) {
        profileListener();
        profileListener = undefined;
      }
      
      if (u?.email) {
        setIsLoading(true);
        try {
          // Use the web SDK for Firestore
          const usersCollection = collection(FIRESTORE_DB, 'users');
          const q = query(usersCollection, where('email', '==', u.email), limit(1));
          
          // First get the profile once
          try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              console.log("Profile fetched successfully:", userData.name || userData.email);
              setProfile(userData);
              setError(null); // Clear any previous errors
            } else {
              console.log("No user profile found for email:", u.email);
              // If we didn't find a profile but authentication succeeded,
              // let's attempt to create a minimal profile using auth data
              console.log("Creating minimal profile from auth data");
              const minimalProfile = {
                uid: u.uid,
                email: u.email,
                name: u.displayName || u.email?.split('@')[0] || 'User',
                role: 'partner', // Default role
                linkedTo: null, // Adding this to prevent UI errors
                createdAt: new Date()
              };
              setProfile(minimalProfile);
              setError(null); // Clear any previous errors
            }
          } catch (err: any) {
            console.error("Permission error fetching profile:", err.message);
            console.log("Firebase error code:", err.code);
            // Create a minimal profile using auth data since we can't access Firestore
            const minimalProfile = {
              uid: u.uid,
              email: u.email,
              name: u.displayName || u.email?.split('@')[0] || 'User',
              role: 'partner', // Default role
              linkedTo: null, // Adding this to prevent UI errors
              createdAt: new Date(),
            };
            setProfile(minimalProfile);
            setError(`Firestore access error: ${err.code}. You may have limited functionality.`);
          }
          
          // Then set up a listener for real-time updates - only if we didn't get a permission error
          try {
            profileListener = onSnapshot(q, (snapshot) => {
              if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();
                console.log("Profile updated:", userData.name || userData.email);
                setProfile(userData);
                setError(null);
              } else {
                console.log("Profile listener: No user found");
                // Don't set profile to null here - keep the minimal profile if we have one
              }
            }, (error) => {
              console.error("Error in profile listener:", error);
              // We already have a minimal profile from the initial fetch, so we'll keep using that
              setError(`Real-time updates unavailable: ${error.code}. Using cached profile.`);
              // Don't attempt to set up the listener again if it fails
              profileListener = undefined;
            });
          } catch (listenerErr: any) {
            console.error("Failed to set up profile listener:", listenerErr);
            setError(`Failed to set up profile updates: ${listenerErr.message}`);
          }
        } catch (error: any) {
          console.error("Error in auth effect:", error);
          setProfile(null);
          setError(`Authentication error: ${error.message}`);
        } finally {
          setIsLoading(false);
          if (initializing) setInitializing(false);
        }
      } else {
        console.log("No user email available, clearing profile");
        setProfile(null);
        setError(null);
        if (initializing) setInitializing(false);
        setIsLoading(false);
      }
    });
    
    return () => {
      // Clean up both listeners when component unmounts
      if (profileListener) profileListener();
      unsubscribe();
    };
  }, []);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
