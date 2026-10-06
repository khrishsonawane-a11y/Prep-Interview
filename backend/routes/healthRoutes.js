import express from 'express';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const configured = isSupabaseConfigured();
    let dbStatus = 'NOT_CONFIGURED';
    let dbError = null;

    if (configured && supabaseAdmin) {
        try {
            const { error } = await supabaseAdmin.from('interviews').select('id', { count: 'exact', head: true });
            if (error) {
                dbStatus = 'ERROR';
                dbError = error.message;
            } else {
                dbStatus = 'OK';
            }
        } catch (err) {
            dbStatus = 'ERROR';
            dbError = err.message;
        }
    }

    let aiProvider = 'Groq / OpenAI (openai/gpt-oss-120b)';
    if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('placeholder')) {
        aiProvider = `Groq (${process.env.GROQ_MODEL || 'openai/gpt-oss-120b'})`;
    } else if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('placeholder')) {
        aiProvider = `Google Gemini (${process.env.GEMINI_MODEL || 'gemini-2.5-flash'})`;
    }

    res.json({
        status: dbStatus === 'ERROR' ? 'degraded' : 'healthy',
        service: 'AI Interview Preparation System API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        supabase: {
            configured: configured ? 'YES' : 'NO',
            connection_health: dbStatus,
            persistence_mode: (configured && dbStatus === 'OK') ? 'SUPABASE' : 'MOCK',
            ...(dbError ? { error: dbError } : {})
        },
        ai_engine: {
            active_provider: aiProvider
        }
    });
});

export default router;
