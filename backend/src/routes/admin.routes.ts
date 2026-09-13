// this file is just for the admin dashboard summary numbers
// i built this so staff can pull one report instead of digging through three tables by hand

import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/admin/report
// this pulls together the numbers a funder would actually want to see
router.get('/report', requireAuth, requireAdmin, async (_req, res) => {
  try {
    // i run these counts one after another, a bigger app might do this in parallel with Promise.all
    const { count: totalMembers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeMembers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'active');

    const { count: pendingBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approvedBookings } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // i pull all money donations to add up a total, this is fine at this scale
    // a much bigger dataset would need this summed on the database side instead
    const { data: moneyDonations } = await supabaseAdmin
      .from('donations')
      .select('amount')
      .eq('type', 'money');

    const totalDonated = (moneyDonations || []).reduce((sum, d) => sum + Number(d.amount || 0), 0);

    const { count: foodParcels } = await supabaseAdmin
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'food_parcel');

    const { count: programmeCount } = await supabaseAdmin
      .from('programmes')
      .select('*', { count: 'exact', head: true });

    res.json({
      report: {
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        pendingBookings: pendingBookings || 0,
        approvedBookings: approvedBookings || 0,
        totalDonated,
        foodParcels: foodParcels || 0,
        programmeCount: programmeCount || 0,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('something went wrong building my report', err);
    res.status(500).json({ error: 'i could not generate the report right now' });
  }
});

export default router;
