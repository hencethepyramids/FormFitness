import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from './supabase';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to request
  (req as any).user = data.user;
  next();
} 