// this is my main entry point, it wires together all my routes and starts the server

import './types';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/members.routes';
import bookingRoutes from './routes/bookings.routes';
import donationRoutes from './routes/donations.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// i only allow my own frontend to call this api, cors blocks everyone else
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// this lets me read json bodies from incoming requests
app.use(express.json());

// a tiny health check route so i can quickly confirm the server is alive
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'riverside hub api is running' });
});

// i mount all my route files under /api, each file handles its own slice of the app
app.use('/api/auth', authRoutes);
app.use('/api', memberRoutes);
app.use('/api', bookingRoutes);
app.use('/api', donationRoutes);
app.use('/api/admin', adminRoutes);

// this catches any route i did not define, so i get a clean 404 instead of a crash
app.use((_req, res) => {
  res.status(404).json({ error: 'that route does not exist on this api' });
});

app.listen(PORT, () => {
  console.log(`my server is listening on port ${PORT}`);
});
