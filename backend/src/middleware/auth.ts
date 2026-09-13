// this middleware checks that a request actually comes from a logged in user
// i pull the token out of the Authorization header and ask supabase if it is valid
// if it is valid, i look up their profile so i know their role, then attach it to req.user

import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    // i expect the header to look like "Bearer <token>", so i check for that format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'i need a valid login token to allow this request' });
    }

    const token = authHeader.split(' ')[1];

    // this asks supabase to confirm the token is real and not expired
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'my server could not verify this login token' });
    }

    // i fetch the profile so i know the role, since the auth user object alone does not have it
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'i could not find a profile for this account' });
    }

    // now i attach the user to the request so my route handlers can use it
    req.user = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
    };

    next();
  } catch (err) {
    console.error('something went wrong in my auth middleware', err);
    res.status(500).json({ error: 'something went wrong while checking my login' });
  }
}

// i use this second middleware on top of requireAuth for admin only routes
// it just checks the role that requireAuth already attached to req.user
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'only staff accounts can access this, sorry' });
  }
  next();
}
