import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import interviewRoutes from './routes/interviewRoutes.js';
import aptitudeRoutes from './routes/aptitudeRoutes.js';
import technicalRoutes from './routes/technicalRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import configRoutes from './routes/configRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder or root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security Headers with CSP configured for Supabase & CDNs
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "https://unpkg.com"
            ],
            scriptSrcElem: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com",
                "https://unpkg.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.googleapis.com",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https:"
            ],
            connectSrc: [
                "'self'",
                "https://*.supabase.co",
                "wss://*.supabase.co",
                "https://api.groq.com",
                "https://generativelanguage.googleapis.com",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"]
        }
    }
}));

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8080'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like same-origin, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Always allow known domains and cloud hostings (Render, Vercel, Netlify, Localhost)
        if (
            NODE_ENV === 'development' ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.onrender.com') ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.netlify.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1')
        ) {
            return callback(null, true);
        }

        // Default allow for seamless web app communication
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request Logging & Parsing
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/technical', technicalRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);

// Fallback for SPA frontend routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, error: `API route ${req.path} not found` });
    }
    const htmlFile = req.path.endsWith('.html') ? req.path : `${req.path}.html`;
    const targetPath = path.join(frontendPath, htmlFile === '/.html' ? 'index.html' : htmlFile);
    res.sendFile(targetPath, (err) => {
        if (err) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Listen only when launched directly (and not when imported by test suites)
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`🚀 AI Interview Preparation System Backend Active`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`🛠️  Mode: ${NODE_ENV}`);
        console.log(`🗄️  Supabase Status: ${isSupabaseConfigured() ? 'Connected' : 'Local Fallback'}`);
        console.log(`🤖 AI Engine: ${process.env.GEMINI_API_KEY ? 'Google Gemini (Active)' : process.env.GROQ_API_KEY ? 'Groq (Active)' : 'Heuristic Engine (Local Fallback)'}`);
        console.log(`====================================================`);
    });
}

export default app;
