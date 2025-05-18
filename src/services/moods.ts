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
  mood: number; // 0-4
  energy: number; // 0-4
  hydration: number; // 0-4
  note?: string;
  timestamp: number; // ms since epoch
}
export interface MoodInput {
  mood: number;
  energy: number;
  hydration: number;
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
      const rawTs = (data.timestamp as Timestamp | null);
      const ts = rawTs?.toMillis() ?? Date.now();
      return {
        id: doc.id,
        mood: data.mood,
        energy: data.energy,
        hydration: data.hydration,
        note: data.note,
        timestamp: ts,
      };
    });
    callback(list);
  });
};
