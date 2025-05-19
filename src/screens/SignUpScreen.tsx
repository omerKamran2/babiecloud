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
import { Picker } from '@react-native-picker/picker';

type AuthStackParamList = {
  SignUp: undefined;
  Login: undefined;
};
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const SPACING = 16;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'partner' | 'support'>('partner');
  const [linkedTo, setLinkedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(
        name.trim(),
        email.trim(),
        password,
        role,
        linkedTo,
      );
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
            placeholder="Name"
            placeholderTextColor={scheme === 'dark' ? '#666' : '#999'}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            accessibilityLabel="Name Input"
          />
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
          <Text style={[styles.label, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Role</Text>
          <View style={[styles.pickerWrapper, { borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }]}>  
            <Picker
              selectedValue={role}
              onValueChange={(val: 'partner' | 'support') => setRole(val)}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="Partner" value="partner" />
              <Picker.Item label="Support" value="support" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Partner UID (optional)"
            placeholderTextColor={scheme === 'dark' ? '#666' : '#999'}
            value={linkedTo}
            onChangeText={setLinkedTo}
            autoCapitalize="none"
            accessibilityLabel="Partner UID Input"
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
  label: { marginBottom: 8, fontWeight: '600' },
  pickerWrapper: { marginBottom: SPACING },
  picker: { height: 48, width: '100%' },
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
