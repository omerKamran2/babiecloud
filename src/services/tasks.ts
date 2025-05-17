// src/services/tasks.ts
import { FIRESTORE_DB } from '../../FirebaseConfig';
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  createdAt: Timestamp;
}

const tasksCollection = (uid: string) =>
  collection(FIRESTORE_DB, 'users', uid, 'tasks');

export const listenToTasks = (
  uid: string,
  callback: (tasks: Task[]) => void
): (() => void) => {
  const q = query(tasksCollection(uid), orderBy('dueDate', 'asc'));
  return onSnapshot(q, snapshot => {
    const results: Task[] = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const dueTs = data.dueDate as Timestamp;
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        dueDate: dueTs.toDate().toISOString().split('T')[0],
        createdAt: data.createdAt,
      };
    });
    callback(results);
  });
};

export const addTask = (
  uid: string,
  task: { title: string; description?: string; dueDate: string }
) =>
  addDoc(tasksCollection(uid), {
    ...task,
    dueDate: Timestamp.fromDate(new Date(task.dueDate)),
    createdAt: serverTimestamp(),
  });

export const updateTask = (
  uid: string,
  id: string,
  data: Partial<{ title: string; description?: string; dueDate: string }>
) => {
  const docRef = doc(FIRESTORE_DB, 'users', uid, 'tasks', id);
  const payload: any = { ...data };
  if (data.dueDate) {
    payload.dueDate = Timestamp.fromDate(new Date(data.dueDate));
  }
  return updateDoc(docRef, payload);
};

export const deleteTask = (uid: string, id: string) =>
  deleteDoc(doc(FIRESTORE_DB, 'users', uid, 'tasks', id));
