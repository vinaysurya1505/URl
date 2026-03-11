import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file is zip
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Only .zip files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 500MB limit' },
        { status: 400 }
      );
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // Create reference in Firebase Storage
    const storageRef = ref(storage, `uploads/${fileName}`);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        fileName: file.name,
        size: file.size,
        path: snapshot.metadata.fullPath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
