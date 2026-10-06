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

// Known valid production credentials for Supabase project fndwiwualrquwilfntmt
const DEFAULT_URL = 'https://fndwiwualrquwilfntmt.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZHdpd3VhbHJxdXdpbGZudG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTk3MDQsImV4cCI6MjEwNjU5NTcwNH0.1H7yw5pvxtwzvwfRmvaxqyosuTHltiv9IeEHV8HIsg4';
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZHdpd3VhbHJxdXdpbGZudG10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAxOTcwNCwiZXhwIjoyMTA2NTk1NzA0fQ.sUh6rKApTaLdthklsfFOAv9jdcCZG6y9pnjuUGeC1b4';

/**
 * Validate a JWT structure and check payload fields
 */
const parseJwt = (token) => {
    try {
        if (!token || typeof token !== 'string') return null;
        const parts = token.trim().split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    } catch {
        return null;
    }
};

const isValidKey = (token, expectedRole) => {
    const payload = parseJwt(token);
    if (!payload || !payload.iss || !payload.ref) return false;
    if (expectedRole && payload.role !== expectedRole) return false;
    return true;
};

// Resolve Supabase URL
const rawUrl = cleanEnvVar(process.env.SUPABASE_URL);
export const supabaseUrl = (rawUrl && rawUrl.startsWith('https://') && rawUrl.includes('.supabase.co'))
    ? rawUrl
    : DEFAULT_URL;

// Resolve Supabase Anon Key
const rawAnonKey = cleanEnvVar(process.env.SUPABASE_ANON_KEY) || cleanEnvVar(process.env.SUPABASE_KEY);
export const supabaseAnonKey = isValidKey(rawAnonKey, 'anon') ? rawAnonKey : DEFAULT_ANON_KEY;

// Resolve Supabase Service Role Key
const rawServiceKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY) || cleanEnvVar(process.env.SUPABASE_SERVICE_KEY);
export const supabaseServiceRoleKey = isValidKey(rawServiceKey, 'service_role') ? rawServiceKey : DEFAULT_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = () => {
    return Boolean(
        supabaseUrl &&
        supabaseAnonKey &&
        supabaseUrl.startsWith('https://') &&
        !supabaseUrl.includes('placeholder')
    );
};

export const isServiceRoleConfigured = () => {
    return Boolean(
        supabaseServiceRoleKey &&
        isValidKey(supabaseServiceRoleKey, 'service_role')
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
                apikey: supabaseAnonKey,
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
    isServiceRoleConfigured,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey
};
