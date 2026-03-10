import { NextRequest, NextResponse } from 'next/server';
import { addEntry } from '@/lib/entries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, url } = body;

    // Validate input
    if (!topic || !url) {
      return NextResponse.json(
        { error: 'Topic and URL are required' },
        { status: 400 }
      );
    }

    // Add the entry to Firestore
    const entry = await addEntry(topic.trim(), url.trim());

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
    
    return NextResponse.json(
      { 
        error: errorMessage || 'Failed to save entry to Firestore'
      },
      { status: 500 }
    );
  }
}
