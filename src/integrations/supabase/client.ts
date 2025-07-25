// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xvaqmfzoypjnrtshiskm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YXFtZnpveXBqbnJ0c2hpc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzAyMTEsImV4cCI6MjA2Nzk0NjIxMX0.4vd4jyn1TaIDQtAtj1vBWOIiTHtC543PkpZgjMDxeTw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});