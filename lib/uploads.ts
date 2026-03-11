import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { ref, deleteObject, getBytes } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadedFile {
  id: string;
  title: string;
  fileName: string;
  size: number;
  path: string;
  uploadedAt: Date;
  type: 'upload';
}

export async function getAllUploads(): Promise<UploadedFile[]> {
  try {
    const uploadsCollection = collection(db, 'uploads');
    const q = query(uploadsCollection, orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      fileName: doc.data().fileName,
      size: doc.data().size,
      path: doc.data().path,
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
      type: 'upload',
    }));
  } catch (error) {
    console.error('Error fetching uploads:', error);
    return [];
  }
}

export async function addUploadMetadata(
  title: string,
  fileName: string,
  size: number,
  path: string
) {
  try {
    const uploadsCollection = collection(db, 'uploads');
    const docRef = await addDoc(uploadsCollection, {
      title,
      fileName,
      size,
      path,
      uploadedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding upload metadata:', error);
    throw error;
  }
}

export async function deleteUpload(uploadId: string, filePath: string) {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, 'uploads', uploadId));

    // Delete from Firebase Storage
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting upload:', error);
    throw error;
  }
}

export async function downloadFile(filePath: string, fileName: string) {
  try {
    const fileRef = ref(storage, filePath);
    const bytes = await getBytes(fileRef);
    
    // Create a blob and download
    const blob = new Blob([bytes]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}
