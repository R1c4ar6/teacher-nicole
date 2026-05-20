import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export default supabase;
export { supabase };

export const getProfile = async (userId) => {
  if (!userId) return { data: null, error: new Error('No user ID') };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('getProfile error:', err);
    return { data: null, error: err };
  }
};

export const createProfile = async (profile) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('createProfile error:', err);
    return { data: null, error: err };
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('updateProfile error:', err);
    return { data: null, error: err };
  }
};

export const getPackages = async () => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return { data: data || [], error };
  } catch (err) {
    console.error('getPackages error:', err);
    return { data: [], error: err };
  }
};

export const getPackage = async (id) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  } catch (err) {
    console.error('getPackage error:', err);
    return { data: null, error: err };
  }
};

export const getBookings = async (userId) => {
  if (!userId) return { data: [], error: null };
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        package:packages(*),
        tutor:profiles!bookings_tutor_id_fkey(*)
      `)
      .eq('student_id', userId)
      .order('start_time', { ascending: true });
    return { data: data || [], error };
  } catch (err) {
    console.error('getBookings error:', err);
    return { data: [], error: err };
  }
};

export const createBooking = async (booking) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('createBooking error:', err);
    return { data: null, error: err };
  }
};

export const updateBooking = async (bookingId, updates) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('updateBooking error:', err);
    return { data: null, error: err };
  }
};

export const getApprovedTestimonials = async () => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  } catch (err) {
    console.error('getApprovedTestimonials error:', err);
    return { data: [], error: err };
  }
};

export const submitTestimonial = async (testimonial) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('submitTestimonial error:', err);
    return { data: null, error: err };
  }
};

export const getAvailableSlots = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase.rpc('get_available_slots', { start_date: startDate, end_date: endDate });
    return { data: data || [], error };
  } catch (err) {
    console.error('getAvailableSlots error:', err);
    return { data: [], error: err };
  }
};

export const getSettings = async (key) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    return { data: data?.value, error };
  } catch (err) {
    console.error('getSettings error:', err);
    return { data: null, error: err };
  }
};