import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserProfile } from '../types/user';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export interface UserRequest extends Request {
  user?: UserProfile;
}

export const verifyUser = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.user_token;

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserProfile;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
    console.error('Token verification error:', error);
  }
};
