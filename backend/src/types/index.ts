// i keep all my shared types in one place so my routes stay consistent
// these mirror the columns i set up in my supabase schema.sql file

export type UserRole = 'member' | 'admin';
export type MembershipStatus = 'active' | 'inactive' | 'pending';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type FacilityType = 'room' | 'gym' | 'equipment';
export type DonationType = 'money' | 'food_parcel';
export type DonationStatus = 'received' | 'processed' | 'distributed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  membership_status: MembershipStatus;
  created_at: string;
}

export interface Programme {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  schedule: string | null;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  description: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  facility_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string | null;
  donor_name: string;
  donor_email: string | null;
  type: DonationType;
  amount: number | null;
  item_description: string | null;
  status: DonationStatus;
  created_at: string;
}

// i extend express's Request type here so i can attach the logged in user to req.user
// this saves me from re-checking the token in every single route handler
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
