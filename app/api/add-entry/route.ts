import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { addEntry } from '@/lib/entries';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated using request cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const auth = await verifyToken(token);
    
    if (!auth?.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { topic, url } = body;

    // Validate input
    if (!topic || !url) {
      return NextResponse.json(
        { error: 'Topic and URL are required' },
        { status: 400 }
      );
    }

    // Add the entry
    const entry = addEntry(topic.trim(), url.trim());

    return NextResponse.json(
      { 
        success: true, 
        message: 'Entry added successfully',
        entry 
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Add entry error:', error);
    
    // Provide more helpful error message
    const isFileSystemError = errorMessage.includes('entries') || errorMessage.includes('EACCES') || errorMessage.includes('ENOENT');
    
    return NextResponse.json(
      { 
        error: isFileSystemError 
          ? 'Failed to save entry to file system. Check server logs and file permissions.' 
          : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
