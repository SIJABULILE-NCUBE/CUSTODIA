// this file covers the membership side of the platform
// it handles listing youth programmes and letting members enroll in them

import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/programmes
// public route, anyone visiting the site can see what programmes riverside offers
router.get('/programmes', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('programmes')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'i could not load the programmes right now' });
  }

  res.json({ programmes: data });
});

// POST /api/programmes
// admin only, this is how staff add a new youth programme
router.post('/programmes', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, capacity, schedule } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'a programme needs at least a name' });
  }

  const { data, error } = await supabaseAdmin
    .from('programmes')
    .insert({ name, description, capacity: capacity || 20, schedule })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'i could not create that programme' });
  }

  res.status(201).json({ programme: data });
});

// POST /api/programmes/:id/enroll
// a logged in member uses this to join a programme
router.post('/programmes/:id/enroll', requireAuth, async (req, res) => {
  const programmeId = req.params.id;

  // i first check how many people are already enrolled, so i respect the capacity
  const { count, error: countError } = await supabaseAdmin
    .from('programme_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('programme_id', programmeId);

  if (countError) {
    return res.status(500).json({ error: 'i could not check the programme capacity' });
  }

  const { data: programme } = await supabaseAdmin
    .from('programmes')
    .select('capacity, name')
    .eq('id', programmeId)
    .single();

  if (programme && count !== null && count >= programme.capacity) {
    return res.status(409).json({ error: `sorry, ${programme.name} is already full` });
  }

  const { data, error } = await supabaseAdmin
    .from('programme_enrollments')
    .insert({ programme_id: programmeId, user_id: req.user!.id })
    .select()
    .single();

  if (error) {
    // this usually means they already enrolled, since i have a unique constraint on the pair
    return res.status(409).json({ error: 'it looks like you are already enrolled in this programme' });
  }

  res.status(201).json({ enrollment: data });
});

// GET /api/members/me/enrollments
// a member checks their own programme history
router.get('/members/me/enrollments', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('programme_enrollments')
    .select('*, programmes(name, schedule)')
    .eq('user_id', req.user!.id);

  if (error) {
    return res.status(500).json({ error: 'i could not load your enrollments' });
  }

  res.json({ enrollments: data });
});

export default router;
