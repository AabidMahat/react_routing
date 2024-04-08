import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://wwrjpeselhicsjvdtjyz.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cmpwZXNlbGhpY3NqdmR0anl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1MTMzNjgsImV4cCI6MjAyNDA4OTM2OH0.dNM6InJvBhW3THia8V2X5_t-0jJnzQnavKO5vYFu5mE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
