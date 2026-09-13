// this file covers the donation drive
// i support two kinds of donations here, cash and food parcels, in one shared table

import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// POST /api/donations
// this route is open to anyone, even without an account, since donations can be anonymous
router.post('/donations', async (req, res) => {
  const { donor_name, donor_email, type, amount, item_description, user_id } = req.body;

  if (!donor_name || !type) {
    return res.status(400).json({ error: 'i need at least a donor name and a donation type' });
  }

  if (type === 'money' && !amount) {
    return res.status(400).json({ error: 'a money donation needs an amount' });
  }

  if (type === 'food_parcel' && !item_description) {
    return res.status(400).json({ error: 'a food parcel donation needs a description of the items' });
  }

  const { data, error } = await supabaseAdmin
    .from('donations')
    .insert({
      donor_name,
      donor_email,
      type,
      amount: type === 'money' ? amount : null,
      item_description: type === 'food_parcel' ? item_description : null,
      user_id: user_id || null, // i let this stay null for a walk in or anonymous donor
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'i could not save that donation' });
  }

  res.status(201).json({ donation: data, message: 'thank you, riverside really appreciates this' });
});

// GET /api/donations/me
// a logged in donor can see the donations linked to their account
router.get('/donations/me', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('donations')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'i could not load your donation history' });
  }

  res.json({ donations: data });
});

// GET /api/donations
// admin only, staff use this to see the full donation list for reporting
router.get('/donations', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'i could not load the donations list' });
  }

  res.json({ donations: data });
});

// PATCH /api/donations/:id/status
// admin only, this moves a donation through received, processed, then distributed
router.patch('/donations/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['received', 'processed', 'distributed'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'that is not a status i recognise' });
  }

  const { data, error } = await supabaseAdmin
    .from('donations')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'i could not update that donation' });
  }

  res.json({ donation: data });
});

export default router;
