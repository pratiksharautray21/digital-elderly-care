import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hapxevqmzqgfrkwzposy.supabase.co";

const supabasePublishableKey = "sb_publishable_zFr2vwRd_YN45MbSXJpeaw_TAr0Rj9D";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);