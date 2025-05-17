import React from 'react';
import { TextInput, Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Controller } from 'react-hook-form';

interface ControlledInputProps {
  control: any;
  name: string;
  placeholder: string;
}

const ControlledInput: React.FC<ControlledInputProps> = ({ control, name, placeholder }) => {
  const scheme = useColorScheme();
  const placeholderColor = scheme === 'dark' ? '#666' : '#999';

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.wrapper}>
          <TextInput
            style={[styles.input, error && styles.errorBorder]}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            accessibilityLabel={placeholder}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});