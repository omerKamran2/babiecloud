// src/services/widgetContent.ts
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp as FirebaseTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

export interface WidgetContentDoc {
  imageUrl: string;      // Firebase Storage download URL
  title: string;         // optional caption
  timestamp: FirebaseTimestamp;
  type: 'photo';
}

/**
 * Listen for real-time updates of the latest photo widget content
 * @param uid User ID to listen for photos
 * @param callback Function to call when photos update
 * @returns Unsubscribe function
 */
export const listenToLatestPhoto = (
  uid: string,
  callback: (photo: WidgetContentDoc | null) => void
) => {
  const widgetContentRef = collection(FIRESTORE_DB, `users/${uid}/widgetContent`);
  const photoQuery = query(
    widgetContentRef,
    where('type', '==', 'photo'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const unsubscribe = onSnapshot(
    photoQuery,
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      
      // Get first document - we only expect one due to limit(1)
      const doc = snapshot.docs[0];
      callback({ ...doc.data() as WidgetContentDoc });
    },
    (error) => {
      console.error('Error listening to latest photo:', error);
      callback(null);
    }
  );

  return unsubscribe;
};
