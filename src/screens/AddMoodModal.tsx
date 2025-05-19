// src/screens/AddMoodModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { addMood, MoodInput } from '../services/moods';
import EmojiSlider from '../components/EmojiSlider';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const moodOptions = ['😄', '🙂', '😐', '🙁', '😢'];
// Map slider index to MoodInput union value
const moodKeys = ['happy','ok','sad','tired','stressed'] as const;
const energyIcons = ['⚡️', '⚡️', '⚡️', '⚡️', '⚡️'];
const hydrationIcons = ['💧', '💧', '💧', '💧', '💧'];

const AddMoodModal: React.FC<Props> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const [mood, setMood] = useState<number>(-1);
  const [energy, setEnergy] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [hydration, setHydration] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme();

  const handleSave = async () => {
    if (!user || mood < 0) return;
    setLoading(true);
    const entry: MoodInput = {
      mood: moodKeys[mood],
      energy,
      hydration,
      note,
    };
    try {
      await addMood(entry, user.uid);
      onClose();
      setMood(-1);
      setEnergy(0);
      setHydration(0);
      setNote('');
    } catch {
      // TODO: error handler
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { backgroundColor: scheme === 'dark' ? '#333' : '#fff' }]}>            
            <Text style={[styles.title, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Log Mood</Text>
            <Text style={[styles.label, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Mood</Text>
            <EmojiSlider
              options={moodOptions}
              value={mood}
              onChange={setMood}
              accessibilityLabel="Mood Slider"
            />
            <Text style={[styles.label, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Energy</Text>
            <EmojiSlider
              options={energyIcons}
              value={energy}
              onChange={(idx: number) => setEnergy(idx as 0 | 1 | 2 | 3 | 4)}
              accessibilityLabel="Energy Slider"
            />
            <Text style={[styles.label, { color: scheme === 'dark' ? '#fff' : '#000' }]}>Hydration</Text>
            <EmojiSlider
              options={hydrationIcons}
              value={hydration}
              onChange={(idx: number) => setHydration(idx as 0 | 1 | 2 | 3 | 4)}
              accessibilityLabel="Hydration Slider"
            />
            <TextInput
              style={[styles.input, { borderColor: scheme === 'dark' ? '#555' : '#ccc', color: scheme === 'dark' ? '#fff' : '#000' }]}
              placeholder="Optional note"
              placeholderTextColor={scheme === 'dark' ? '#888' : '#999'}
              value={note}
              onChangeText={setNote}
              accessibilityLabel="Note Input"
            />
            {loading ? (
              <ActivityIndicator style={{ marginTop: 16 }} />
            ) : (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: mood >= 0 ? '#007aff' : '#999' },
                ]}
                disabled={mood < 0}
                onPress={handleSave}
                accessibilityLabel="Save Mood Button"
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={[styles.cancelText, { color: scheme === 'dark' ? '#1e90ff' : '#007aff' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMoodModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', padding: 16, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  label: { marginTop: 8, marginBottom: 4, fontSize: 16 },
  input: { height: 40, borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, marginTop: 8 },
  button: { marginTop: 16, paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cancel: { marginTop: 8, alignItems: 'center' },
  cancelText: { fontWeight: 'bold' },
});
