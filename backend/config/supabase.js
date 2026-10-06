import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const cleanEnvVar = (val) => {
    if (!val) return '';
    let str = String(val).trim();
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        str = str.slice(1, -1).trim();
    }
    return str;
};

const supabaseUrl = cleanEnvVar(process.env.SUPABASE_URL);
const supabaseAnonKey = cleanEnvVar(process.env.SUPABASE_ANON_KEY);
const supabaseServiceRoleKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const isSupabaseConfigured = () => {
    return Boolean(
        supabaseUrl &&
        supabaseAnonKey &&
        supabaseUrl.startsWith('https://') &&
        !supabaseUrl.includes('placeholder-project') &&
        !supabaseAnonKey.includes('placeholder-anon-key')
    );
};

const supabaseOptions = {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    realtime: {
        transport: WebSocket
    }
};

// Client initialized with Service Role Key for backend operations
export const supabaseAdmin = isSupabaseConfigured() && supabaseServiceRoleKey && !supabaseServiceRoleKey.includes('placeholder')
    ? createClient(supabaseUrl, supabaseServiceRoleKey, supabaseOptions)
    : isSupabaseConfigured()
        ? createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)
        : null;

// Helper to create a user-scoped client that respects Row Level Security
export const createUserClient = (accessToken) => {
    if (!isSupabaseConfigured()) return null;
    return createClient(supabaseUrl, supabaseAnonKey, {
        ...supabaseOptions,
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    });
};

export default {
    supabaseAdmin,
    createUserClient,
    isSupabaseConfigured
};
