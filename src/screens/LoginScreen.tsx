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
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  signInWithEmail,
  registerWithEmail,
  sendPasswordReset,
} from '../services/auth';

// Define navigation params for this screen
type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

const SPACING = 16;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e: any) {
      setError(firebaseErrorToMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerWithEmail(email.trim(), password);
    } catch (e: any) {
      setError(firebaseErrorToMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setError('Enter your email to reset password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendPasswordReset(email.trim());
      setError('Password reset email sent');
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
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            accessibilityLabel="App Logo"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Input"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password Input"
          />
          {loading ? (
            <ActivityIndicator style={{ marginBottom: SPACING }} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                accessibilityLabel="Sign In Button"
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => navigation.navigate('SignUp')}
                accessibilityRole="button"
                accessibilityLabel="Go to Sign Up"
              >
                <Text style={[styles.buttonText, styles.buttonOutlineText]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={loading}
          >
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

// Map Firebase error codes to user-friendly messages
function firebaseErrorToMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/user-not-found':
      return 'Account not found';
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/weak-password':
      return 'Password is too weak';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: SPACING * 2,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: SPACING / 2,
    marginBottom: SPACING,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: SPACING,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonOutlineText: {
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    marginBottom: SPACING,
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: SPACING,
  },
});
