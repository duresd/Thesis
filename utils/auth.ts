import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // Replace with a strong secret key

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
