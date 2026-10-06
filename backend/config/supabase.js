import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
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

export const isServiceRoleConfigured = () => {
    return Boolean(
        supabaseServiceRoleKey &&
        !supabaseServiceRoleKey.includes('placeholder') &&
        supabaseServiceRoleKey.length > 20
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
export const supabaseAdmin = isSupabaseConfigured() && isServiceRoleConfigured()
    ? createClient(supabaseUrl, supabaseServiceRoleKey, supabaseOptions)
    : isSupabaseConfigured()
        ? createClient(supabaseUrl, supabaseAnonKey, supabaseOptions)
        : null;

// Helper to create a user-scoped client that respects Row Level Security
export const createUserClient = (accessToken) => {
    if (!isSupabaseConfigured() || !accessToken) return null;
    return createClient(supabaseUrl, supabaseAnonKey, {
        ...supabaseOptions,
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    });
};

/**
 * Returns the best available Supabase client for a request:
 * 1. supabaseAdmin with Service Role Key (bypasses RLS) if configured.
 * 2. createUserClient with Bearer token (respects RLS where auth.uid() == user.id) if anon key only.
 */
export const getDbClient = (req) => {
    if (!isSupabaseConfigured()) return null;
    if (isServiceRoleConfigured() && supabaseAdmin) {
        return supabaseAdmin;
    }
    if (req?.token && typeof req.token === 'string' && !req.token.startsWith('mock_')) {
        const userClient = createUserClient(req.token);
        if (userClient) return userClient;
    }
    return supabaseAdmin;
};

export default {
    supabaseAdmin,
    createUserClient,
    getDbClient,
    isSupabaseConfigured,
    isServiceRoleConfigured
};
