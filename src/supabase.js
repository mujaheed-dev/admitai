import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured =
  url && key &&
  url !== 'your-project-url-here' &&
  key !== 'your-anon-key-here'

// Export null when keys are missing so the app still loads.
// Auth features will show a helpful message instead of crashing.
export const supabase = isConfigured ? createClient(url, key) : null
