// this file covers booking facilities and equipment
// the tricky part here is making sure two people cannot double book the same slot

import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/facilities
// public, people need to see what rooms and equipment exist before they book
router.get('/facilities', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('facilities').select('*').order('name');

  if (error) {
    return res.status(500).json({ error: 'i could not load the facilities list' });
  }

  res.json({ facilities: data });
});

// POST /api/bookings
// a logged in member requests a booking, it starts as pending until staff approve it
router.post('/bookings', requireAuth, async (req, res) => {
  const { facility_id, start_time, end_time, notes } = req.body;

  if (!facility_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'i need a facility, a start time and an end time to book this' });
  }

  // i check here for overlapping approved bookings on the same facility
  // this is the main thing stopping double bookings from slipping through
  const { data: clashes, error: clashError } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('facility_id', facility_id)
    .eq('status', 'approved')
    .lt('start_time', end_time)
    .gt('end_time', start_time);

  if (clashError) {
    return res.status(500).json({ error: 'i could not check for booking clashes' });
  }

  if (clashes && clashes.length > 0) {
    return res.status(409).json({ error: 'that time slot is already booked, please pick another time' });
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      facility_id,
      user_id: req.user!.id,
      start_time,
      end_time,
      notes,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'i could not create that booking' });
  }

  res.status(201).json({ booking: data });
});

// GET /api/bookings/me
// a member checks the bookings they personally made
router.get('/bookings/me', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*, facilities(name, type)')
    .eq('user_id', req.user!.id)
    .order('start_time', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'i could not load your bookings' });
  }

  res.json({ bookings: data });
});

// GET /api/bookings
// admin only, staff need to see every pending booking to approve or reject it
router.get('/bookings', requireAuth, requireAdmin, async (req, res) => {
  const statusFilter = req.query.status as string | undefined;

  let query = supabaseAdmin
    .from('bookings')
    .select('*, facilities(name, type), profiles(full_name, email)')
    .order('start_time', { ascending: true });

  // i let staff filter by status from the query string, e.g. /api/bookings?status=pending
  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'i could not load the bookings' });
  }

  res.json({ bookings: data });
});

// PATCH /api/bookings/:id/status
// admin only, this is the approve or reject action from the staff dashboard
router.patch('/bookings/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['approved', 'rejected', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'that is not a status i recognise' });
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'i could not update that booking' });
  }

  res.json({ booking: data });
});

export default router;
