import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID and password are required' },
        { status: 400 }
      );
    }

    const isValid = verifyCredentials(id, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createToken(id);

    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    // Set HTTP-only cookie with the token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
