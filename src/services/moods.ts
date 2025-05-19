import { FIRESTORE_DB } from '../../FirebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

export interface Mood {
  id: string;
  mood: 'happy' | 'ok' | 'sad' | 'tired' | 'stressed';
  energy: 0 | 1 | 2 | 3 | 4;
  hydration: 0 | 1 | 2 | 3 | 4;
  note?: string;
  timestamp: Timestamp;
}
export interface MoodInput {
  mood: 'happy' | 'ok' | 'sad' | 'tired' | 'stressed';
  energy: 0 | 1 | 2 | 3 | 4;
  hydration: 0 | 1 | 2 | 3 | 4;
  note?: string;
}

const moodsCollection = (uid: string) =>
  collection(FIRESTORE_DB, 'users', uid, 'moods');

export const addMood = (entry: MoodInput, uid: string) =>
  addDoc(moodsCollection(uid), {
    ...entry,
    timestamp: serverTimestamp(),
  });

export const listenToMoods = (
  uid: string,
  callback: (moods: Mood[]) => void
): (() => void) => {
  const q = query(moodsCollection(uid), orderBy('timestamp', 'desc'));
  return onSnapshot(q, snapshot => {
    const list: Mood[] = snapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        mood: data.mood as 'happy' | 'ok' | 'sad' | 'tired' | 'stressed',
        energy: data.energy,
        hydration: data.hydration,
        note: data.note,
        timestamp: data.timestamp as Timestamp,
      };
    });
    callback(list);
  });
};
