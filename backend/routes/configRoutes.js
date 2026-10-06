import express from 'express';

const router = express.Router();

/**
 * Public Configuration Endpoint for Frontend Initialization
 * Note: Only public non-sensitive keys (anon key and project URL) are returned.
 * Backend secrets (like service_role key or Gemini API key) MUST NEVER be exposed.
 */
router.get('/', (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://fndwiwualrquwilfntmt.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZHdpd3VhbHJxdXdpbGZudG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTk3MDQsImV4cCI6MjEwNjU5NTcwNH0.1H7yw5pvxtwzvwfRmvaxqyosuTHltiv9IeEHV8HIsg4';

    res.json({
        success: true,
        SUPABASE_URL: supabaseUrl,
        SUPABASE_ANON_KEY: supabaseAnonKey,
        isConfigured: Boolean(supabaseUrl && !supabaseUrl.includes('placeholder'))
    });
});

export default router;
