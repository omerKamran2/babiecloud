// src/services/supportPartners.ts
import { FIRESTORE_DB } from '../../FirebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { Task } from './tasks';
import { Mood } from './moods';

export interface PartnerSummary {
  uid: string;
  name: string;
  email: string;
  lastActive?: Timestamp;
  lastMood?: {
    mood: 'happy' | 'ok' | 'sad' | 'tired' | 'stressed';
    timestamp: Timestamp;
  };
  taskCount: {
    total: number;
    completed: number;
  };
  moodCount: number;
}

export interface PartnerStats {
  loading: boolean;
  partners: PartnerSummary[];
  error?: string;
}

/**
 * Get all partners linked to a support user
 */
export const getLinkedPartners = async (supportUid: string): Promise<string[]> => {
  const partnersRef = collection(FIRESTORE_DB, 'users');
  const q = query(partnersRef, where('linkedTo', '==', supportUid));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.id);
};

/**
 * Listen to all partners linked to a support user
 */
export const listenToPartnerStats = (
  supportUid: string,
  callback: (stats: PartnerStats) => void
): (() => void) => {
  // Start with loading state
  callback({ loading: true, partners: [] });
  
  console.log('Starting to listen for partners linked to support UID:', supportUid);
  
  // Try to query by both UID and email to ensure we catch all links
  const partnersRef = collection(FIRESTORE_DB, 'users');
  const q = query(partnersRef, where('linkedTo', '==', supportUid));
  
  return onSnapshot(q, async snapshot => {
    try {
      console.log('Partners snapshot received, documents count:', snapshot.docs.length);
      const partners: PartnerSummary[] = [];
      
      // Process each partner
      for (const docSnap of snapshot.docs) {
        const partnerData = docSnap.data();
        const partnerUid = docSnap.id;
        
        console.log('Processing partner:', partnerUid, partnerData.name, partnerData.email);
        console.log('LinkedTo value:', partnerData.linkedTo);
        
        try {
          // Get partner's tasks
          const tasksRef = collection(FIRESTORE_DB, 'users', partnerUid, 'tasks');
          const tasksSnapshot = await getDocs(tasksRef);
          const tasks = tasksSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as Task[];
          
          // Get partner's moods
          const moodsRef = collection(FIRESTORE_DB, 'users', partnerUid, 'moods');
          const moodsSnapshot = await getDocs(moodsRef);
          const moods = moodsSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as Mood[];
          
          console.log(`Partner ${partnerUid} has ${tasks.length} tasks and ${moods.length} moods`);
          
          // Get last mood if any
          let lastMood = undefined;
          if (moods.length > 0) {
            // Find the most recent mood
            const sortedMoods = [...moods].sort((a, b) => {
              const dateA = a.timestamp?.toDate?.() || new Date(0);
              const dateB = b.timestamp?.toDate?.() || new Date(0);
              return dateB.getTime() - dateA.getTime();
            });
            
            if (sortedMoods[0] && sortedMoods[0].timestamp) {
              lastMood = {
                mood: sortedMoods[0].mood,
                timestamp: sortedMoods[0].timestamp,
              };
            }
          }
          
          // Calculate task statistics
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(task => task.isCompleted).length;
          
          partners.push({
            uid: partnerUid,
            name: partnerData.name || 'Unknown',
            email: partnerData.email || '',
            lastActive: partnerData.lastActive,
            lastMood,
            taskCount: {
              total: totalTasks,
              completed: completedTasks,
            },
            moodCount: moods.length,
          });
        } catch (partnerError) {
          console.error(`Error processing partner ${partnerUid}:`, partnerError);
        }
      }
      
      // Return the complete stats
      console.log('Returning stats with', partners.length, 'partners');
      callback({
        loading: false,
        partners,
      });
    } catch (error) {
      console.error('Failed to load partner statistics:', error);
      callback({
        loading: false,
        partners: [],
        error: 'Failed to load partner statistics',
      });
    }
  }, error => {
    console.error('Failed to connect to the database:', error);
    callback({
      loading: false,
      partners: [],
      error: 'Failed to connect to the database',
    });
  });
};

/**
 * Get details for a specific partner
 */
export const getPartnerDetails = async (
  partnerUid: string
): Promise<PartnerSummary | null> => {
  try {
    const partnerRef = doc(FIRESTORE_DB, 'users', partnerUid);
    const partnerDoc = await getDoc(partnerRef);
    
    if (!partnerDoc.exists()) {
      return null;
    }
    
    const partnerData = partnerDoc.data();
    
    // Get partner's tasks
    const tasksRef = collection(FIRESTORE_DB, 'users', partnerUid, 'tasks');
    const tasksSnapshot = await getDocs(tasksRef);
    const tasks = tasksSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Task[];
    
    // Get partner's moods
    const moodsRef = collection(FIRESTORE_DB, 'users', partnerUid, 'moods');
    const moodsSnapshot = await getDocs(moodsRef);
    const moods = moodsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Mood[];
    
    // Get last mood if any
    let lastMood = undefined;
    if (moods.length > 0) {
      const sortedMoods = [...moods].sort((a, b) => {
        return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
      });
      
      if (sortedMoods[0]) {
        lastMood = {
          mood: sortedMoods[0].mood,
          timestamp: sortedMoods[0].timestamp,
        };
      }
    }
    
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    
    return {
      uid: partnerUid,
      name: partnerData.name || 'Unknown',
      email: partnerData.email || '',
      lastActive: partnerData.lastActive,
      lastMood,
      taskCount: {
        total: totalTasks,
        completed: completedTasks,
      },
      moodCount: moods.length,
    };
  } catch (error) {
    console.error('Error getting partner details:', error);
    return null;
  }
};
