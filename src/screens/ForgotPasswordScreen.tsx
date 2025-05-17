// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { sendPasswordReset } from '../services/auth';
import { firebaseErrorToMessage } from '../services/auth';

const SPACING = 16;

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const scheme = useColorScheme();

  const handleReset = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordReset(email.trim());
      setMessage('Password reset email sent');
    } catch (e: any) {
      setMessage(firebaseErrorToMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {message && <Text style={styles.message}>{message}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={scheme === 'dark' ? '#666' : '#999'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Input"
          />
          {loading ? (
            <ActivityIndicator style={{ marginTop: SPACING }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}
              onPress={handleReset}
              accessibilityLabel="Reset Password Button"
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center' },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: SPACING / 2,
    marginBottom: SPACING,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: SPACING,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  message: { textAlign: 'center', color: '#333', marginBottom: SPACING },
});
