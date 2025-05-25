import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

// Use a consistent JWT secret
const JWT_SECRET = new TextEncoder().encode(
  'your-super-secret-jwt-key-marketplace-2024'
);

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export const verifyTokenEdge = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

export const getTokenFromHeader = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const getTokenFromCookie = (req: NextRequest): string | null => {
  try {
    const token = req.cookies.get('token')?.value;
    return token || null;
  } catch (error) {
    console.error('Error getting token from cookie:', error);
    return null;
  }
};
