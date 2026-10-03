import express from 'express';
import { isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

router.get('/', (req, res) => {
    let aiProvider = 'Heuristic Engine (Local Fallback)';
    if (process.env.GEMINI_API_KEY) {
        aiProvider = `Google Gemini (${process.env.GEMINI_MODEL || 'gemini-2.5-flash'})`;
    } else if (process.env.GROQ_API_KEY) {
        aiProvider = `Groq (${process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'})`;
    }

    res.json({
        status: 'healthy',
        service: 'AI Interview Preparation System API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        supabase_connected: isSupabaseConfigured(),
        ai_provider: aiProvider
    });
});

export default router;
