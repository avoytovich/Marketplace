import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// Use a consistent JWT secret
const JWT_SECRET = new TextEncoder().encode(
  'your-super-secret-jwt-key-marketplace-2024'
);

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  [key: string]: string | number; // Add index signature for jose compatibility
}

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Type assertion after validating required fields
    const jwtPayload = payload as {
      userId: number;
      email: string;
      role: string;
    };
    if (!jwtPayload.userId || !jwtPayload.email || !jwtPayload.role) {
      throw new Error('Invalid token payload');
    }
    return jwtPayload as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
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
