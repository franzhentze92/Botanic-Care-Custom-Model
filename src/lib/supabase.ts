import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('Please create a .env file in the root directory with:');
  console.error('VITE_SUPABASE_URL=your_supabase_project_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('');
  console.error('Get these values from your Supabase project:');
  console.error('1. Go to https://supabase.com');
  console.error('2. Open your project');
  console.error('3. Go to Settings > API');
  console.error('4. Copy the Project URL and anon/public key');
  
  // Create a dummy client to prevent crashes during development
  // This allows the app to load, but API calls will fail gracefully
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key'
  );
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('❌ Invalid Supabase URL format:', supabaseUrl);
    console.error('URL must be a valid HTTPS URL (e.g., https://xxxxx.supabase.co)');
    
    // Create a dummy client to prevent crashes
    supabase = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }
}

export { supabase };

