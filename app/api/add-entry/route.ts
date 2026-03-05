import { NextRequest, NextResponse } from 'next/server';
import { getAuthStatus } from '@/lib/auth';
import { addEntry } from '@/lib/entries';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const auth = await getAuthStatus();
    
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
    console.error('Add entry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
