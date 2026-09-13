// this file handles signing up and logging in
// i am letting supabase do the heavy lifting for password hashing and sessions
// i just wrap it in my own api so my frontend has one consistent place to call

import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
// this is how a new member signs up on the public site
router.post('/register', async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  // i do a quick check here before even touching supabase, saves a wasted request
  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'i need an email, password and full name to register someone' });
  }

  // this creates the auth user, my database trigger then creates the profile row automatically
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // i am skipping email confirmation for this demo, a real launch would turn this off
    user_metadata: { full_name },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // if they gave me a phone number, i update the profile with it right after creation
  if (phone && data.user) {
    await supabaseAdmin.from('profiles').update({ phone }).eq('id', data.user.id);
  }

  res.status(201).json({ message: 'welcome to riverside, your account is ready', userId: data.user?.id });
});

// POST /api/auth/login
// i sign the user in and hand back the session token my frontend needs to store
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'i need both an email and password to log someone in' });
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'that email or password does not look right' });
  }

  res.json({
    session: data.session,
    user: data.user,
  });
});

// GET /api/auth/me
// this lets my frontend ask "who am i logged in as right now"
router.get('/me', requireAuth, async (req, res) => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user!.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'i could not find your profile' });
  }

  res.json({ profile });
});

export default router;
