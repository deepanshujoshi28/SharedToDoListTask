import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel';
import admin from '../config/firebaseAdmin';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const dbUser = await createUser(name, email, hashedPassword);

    const token = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    res.status(201).json({ token, user: dbUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email) as User;
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const token = jwt.sign({ userId: user.id , userEmail : user.email}, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


interface AuthPayload {
  userId: string;
}

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false, error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    res.status(200).json({ valid: true, userId: decoded.userId });
  } catch (err) {
    console.error(err);
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
};
