// src/components/EmojiSlider.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, useColorScheme, View } from 'react-native';

interface EmojiSliderProps {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  accessibilityLabel?: string;
}

const EmojiSlider: React.FC<EmojiSliderProps> = ({ options, value, onChange, accessibilityLabel }) => {
  const scheme = useColorScheme();
  const activeBorder = scheme === 'dark' ? '#1e90ff' : '#007aff';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((emoji, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => onChange(idx)}
          style={[
            styles.item,
            value === idx && { borderColor: activeBorder, borderWidth: 2 },
          ]}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default EmojiSlider;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  item: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
});
