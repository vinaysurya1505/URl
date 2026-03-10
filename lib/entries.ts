import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  getCountFromServer,
  QueryConstraint,
  where,
} from 'firebase/firestore';

export interface Entry {
  id?: string;
  number: number;
  topic: string;
  url: string;
  createdAt?: number;
}

const ENTRIES_COLLECTION = 'entries';

// Read all entries from Firestore
export async function readEntries(): Promise<Entry[]> {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      orderBy('number', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const entries: Entry[] = [];
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as Entry);
    });
    return entries;
  } catch (error) {
    console.error('Error reading entries:', error);
    return [];
  }
}

// Get the next entry number
export async function getNextEntryNumber(): Promise<number> {
  try {
    const entries = await readEntries();
    if (entries.length === 0) {
      return 1;
    }
    return Math.max(...entries.map(e => e.number)) + 1;
  } catch (error) {
    console.error('Error getting next entry number:', error);
    return 1;
  }
}

// Add a new entry to Firestore
export async function addEntry(topic: string, url: string): Promise<Entry> {
  try {
    const nextNumber = await getNextEntryNumber();
    
    const newEntry = {
      number: nextNumber,
      topic,
      url,
      createdAt: Date.now(),
    };
    
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), newEntry);
    
    return {
      id: docRef.id,
      ...newEntry,
    };
  } catch (error) {
    console.error('Error adding entry:', error);
    throw new Error(`Failed to add entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get all entries for display
export async function getAllEntries(): Promise<Entry[]> {
  return readEntries();
}
