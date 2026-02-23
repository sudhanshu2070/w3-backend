import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, UserRole, AuthResponse } from '../types/user';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

const mapRole = (role: string): UserRole => {
  const upperRole = role.toUpperCase();
  if (
    upperRole === 'USER' ||
    upperRole === 'ADMIN' ||
    upperRole === 'SUPER_ADMIN'
  ) {
    return upperRole;
  }
  return 'USER';
};

export const loginUser = async (
  req: Request,
  res: Response<AuthResponse>,
): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ message: 'Identifier and password are required' });
      return;
    }

    const { data: user, error } = await supabase
      .from('user')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (error || !user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const dbUser = user as User;

    if (!dbUser.password_hash) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      dbUser.password_hash,
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const mappedRole = mapRole(dbUser.role);

    const token = jwt.sign(
      {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        role: mappedRole,
      },
      JWT_SECRET,
      {
        expiresIn: '2h',
      },
    );

    res.cookie('user_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        role: mappedRole,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.clearCookie('user_token');
  res.status(200).json({ message: 'Logout successful' });
};

export const verifyToken = (req: Request, res: Response): void => {
  res.status(200).json({ valid: true });
};
