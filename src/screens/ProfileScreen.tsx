// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  Platform,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { signOut } from '../services/auth';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const { user, profile, error } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const textColor = { color: isDark ? '#fff' : '#000' };
  const cardColor = { backgroundColor: isDark ? '#1c1c1e' : '#fff' };
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Animation effect when profile loads
  useEffect(() => {
    if (profile) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [profile]);

  // Add debug logs
  React.useEffect(() => {
    const newLogs = [];
    newLogs.push(`Debug time: ${new Date().toLocaleTimeString()}`);
    newLogs.push(`User object exists: ${user ? 'Yes' : 'No'}`);
    
    if (user) {
      newLogs.push(`User UID: ${user.uid}`);
      newLogs.push(`User email: ${user.email}`);
    }
    
    newLogs.push(`Profile object exists: ${profile ? 'Yes' : 'No'}`);
    
    if (profile) {
      newLogs.push(`Profile data: ${Object.keys(profile).join(', ')}`);
    }
    
    console.log('ProfileScreen Debug:', newLogs.join('\n'));
    setDebugInfo(newLogs);
  }, [user, profile]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" color={scheme === 'dark' ? '#1e90ff' : '#007aff'} />
        <Text style={[styles.loadingText, textColor]}>Loading profile...</Text>
        
        {/* Debug information */}
        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          {debugInfo.map((log, index) => (
            <Text key={index} style={styles.debugText}>{log}</Text>
          ))}
        </View>
      </View>
    );
  }

  // Format timestamp if it exists
  const createdAtFormatted = profile.createdAt?.toDate ? 
    format(profile.createdAt.toDate(), 'PPP') : 
    'N/A';

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor: isDark ? '#000' : '#f2f2f7' }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Profile Avatar */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' }]}>
            <Text style={[styles.avatarText, { color: isDark ? '#fff' : '#007aff' }]}>
              {profile.name ? profile.name[0].toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.profileNameContainer}>
            <Text style={[styles.profileName, textColor]}>{profile.name || 'User'}</Text>
            <Text style={styles.profileRole}>
              {profile.role === 'support' ? '👨‍⚕️ Support' : '👤 Partner'}
            </Text>
          </View>
        </View>
        
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#fff" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </Animated.View>
      
      <Animated.View style={[styles.card, cardColor, { 
        opacity: fadeAnim,
        transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={20} color={isDark ? '#007aff' : '#007aff'} />
          <Text style={[styles.heading, textColor]}>Personal Information</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>Name</Text>
          <Text style={[styles.value, textColor]}>{profile.name || 'Not set'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>Email</Text>
          <Text style={[styles.value, textColor]}>{profile.email || user?.email || 'Not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>User ID</Text>
          <Text style={[styles.value, textColor, styles.idText]}>{profile.uid || user?.uid || 'Not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>Role</Text>
          <View style={[styles.badge, { backgroundColor: profile.role === 'support' ? '#4cd964' : '#007aff' }]}>
            <Text style={styles.badgeText}>{profile.role || 'Not set'}</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>Joined</Text>
          <Text style={[styles.value, textColor]}>{createdAtFormatted}</Text>
        </View>
      </Animated.View>

      {profile.role === 'partner' && (
        <Animated.View style={[styles.card, cardColor, { 
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="link" size={20} color={isDark ? '#007aff' : '#007aff'} />
            <Text style={[styles.heading, textColor]}>Connection</Text>
          </View>
          
          {profile.linkedTo ? (
            <View style={styles.infoRow}>
              <Text style={[styles.label, textColor]}>Linked to Support</Text>
              <View style={styles.connectionContainer}>
                <View style={styles.connectionBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
                <Text style={[styles.value, textColor]}>{profile.linkedTo}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="link-outline" size={28} color={isDark ? '#555' : '#aaa'} />
              <Text style={[styles.emptyStateText, { color: isDark ? '#888' : '#666' }]}>
                Not connected to a support person yet
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {profile.role === 'support' && (
        <Animated.View style={[styles.card, cardColor, { 
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color={isDark ? '#007aff' : '#007aff'} />
            <Text style={[styles.heading, textColor]}>Support Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, textColor]}>Your ID for Partners</Text>
            <TouchableOpacity 
              style={styles.copyIdContainer}
              onPress={() => {
                // In a real app, you would implement clipboard functionality here
                Alert.alert('ID Copied', 'Your support ID has been copied to clipboard');
              }}
            >
              <Text style={[styles.value, styles.supportIdText, textColor]}>{profile.uid}</Text>
              <Ionicons name="copy-outline" size={18} color={isDark ? '#007aff' : '#007aff'} />
            </TouchableOpacity>
            <Text style={[styles.hint, { color: isDark ? '#aaa' : '#666' }]}>
              Share this ID with your partners so they can link their accounts to you
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Additional profile information */}
      <View style={[styles.card, cardColor]}>
        <Text style={[styles.heading, textColor]}>Settings</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, textColor]}>Notifications</Text>
          <Text style={[styles.value, textColor]}>
            {profile.notificationsEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        
        {/* Display any other profile fields that exist */}
        {Object.entries(profile).map(([key, value]) => {
          // Skip fields we've already explicitly displayed
          if (['uid', 'name', 'email', 'role', 'linkedTo', 'createdAt', 'notificationsEnabled']
              .includes(key)) {
            return null;
          }
          // Skip functions and complex objects we can't easily display
          if (typeof value === 'function' || value === null) {
            return null;
          }
          // Display the field and its value
          return (
            <View style={styles.infoRow} key={key}>
              <Text style={[styles.label, textColor]}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={[styles.value, textColor]}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#ff453a' : '#ff3b30' }]}
        onPress={() => {
          Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              { 
                text: 'Sign Out', 
                onPress: handleSignOut,
                style: 'destructive',
              },
            ],
          );
        }}
        accessibilityLabel="Sign Out Button"
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  // Header styles
  header: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileNameContainer: {
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#8e8e93',
  },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  errorText: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  // Card styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#8e8e93',
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
  idText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  // Connection styles
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionBadge: {
    backgroundColor: '#4cd964',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  // Support ID styles
  copyIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 6,
    padding: 8,
    alignSelf: 'flex-start',
  },
  supportIdText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    marginRight: 8,
  },
  hint: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
  },
  // Debug styles
  debugCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    maxWidth: 350,
  },
  debugTitle: {
    color: '#ff9500',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // Loading styles
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Button styles
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
