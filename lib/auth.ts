import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key'
);

export interface AuthPayload {
  adminId: string;
  authenticated: boolean;
}

// Verify admin credentials against environment variables
export function verifyCredentials(id: string, password: string): boolean {
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }

  return id === adminId && password === adminPassword;
}

// Create a JWT token for authenticated admin
export async function createToken(adminId: string): Promise<string> {
  const token = await new SignJWT({ adminId, authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthPayload;
  } catch (error) {
    return null;
  }
}

// Get current auth status from cookies
export async function getAuthStatus(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

// Check if user is authenticated (for use in server components)
export async function isAuthenticated(): Promise<boolean> {
  const auth = await getAuthStatus();
  return auth?.authenticated === true;
}
