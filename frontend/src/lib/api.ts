// this is my tiny wrapper around fetch so i do not repeat the same headers everywhere
// it grabs my current supabase session and attaches the token to every request i make

import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiRequest(path: string, options: RequestInit = {}) {
  // i pull the current session every time, since the token can refresh between calls
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await response.json();

  // i throw here so my components can just use try and catch instead of checking response.ok every time
  if (!response.ok) {
    throw new Error(body.error || 'something went wrong talking to my server');
  }

  return body;
}
