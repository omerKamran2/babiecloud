// src/screens/SignUpScreen.tsx
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
import { StackNavigationProp } from '@react-navigation/stack';
import { registerUser, firebaseErrorToMessage } from '../services/auth';

type AuthStackParamList = {
  SignUp: undefined;
  Login: undefined;
};
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const SPACING = 16;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(email.trim(), password);
      navigation.replace('Login');
    } catch (e: any) {
      setError(firebaseErrorToMessage(e.code));
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
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={scheme === 'dark' ? '#666' : '#999'}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Input"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={scheme === 'dark' ? '#666' : '#999'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password Input"
          />
          {loading ? (
            <ActivityIndicator style={{ marginTop: SPACING }} />
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}
              onPress={handleSignUp}
              accessibilityLabel="Sign Up Button"
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity disabled={loading} onPress={() => navigation.goBack()}>
            <Text style={[styles.linkText, { color: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
    marginBottom: SPACING,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: SPACING, textAlign: 'center' },
  linkText: { textAlign: 'center', marginTop: SPACING },
});
