# ⚡ AI Interview Preparation System

A production-ready, full-stack web application engineered to help students and job seekers practice realistic end-to-end company interview processes with AI-assisted questions, real-time answer evaluations, safe algorithmic coding sandboxes, voice interaction, and personalized readiness reports.

---

## 🌟 Key Features

- **Multi-Round Interview Pipeline**:
  1. **Aptitude & Reasoning**: Timed Quantitative, Percentages, Time & Work, Profit & Loss, and Logical Puzzles with question palettes and explanations.
  2. **Technical Architecture**: Role-tailored questions (Software Developer, Full Stack, Frontend, Backend, Java, Python) with AI evaluation of correctness, relevance, and missing nuances.
  3. **Coding & DSA Round**: Split-pane IDE with language selection (JavaScript, Python), test case execution, and AI time/space complexity analysis.
  4. **HR & Behavioral Round**: Web Speech API voice-to-text recording, STAR method (Situation, Task, Action, Result) evaluation, and speech synthesis.
  5. **AI Final Report**: Comprehensive candidate readiness score, round-by-round strengths & improvements radar, and personalized study roadmaps.
- **Job Role Specialization**: Tailors questions dynamically to 8+ specific roles with zero repetitive patterns.
- **Strict Row-Level Security (RLS)**: Enforced in Supabase PostgreSQL — candidates can only access their own data.
- **Dual AI Engine Architecture**: Primary integration with **Google Gemini API** (`gemini-2.5-flash`), secondary support for **Groq API** (`llama-3.3-70b-versatile`), and resilient local deterministic fallback heuristics.
- **Safe Sandboxed Code Execution**: Isolates candidate code execution to prevent server-side Remote Code Execution (RCE).
- **Responsive Modern SaaS UI**: Dark slate & cyber glow design system built in vanilla HTML5, CSS3, and modern ES6 JavaScript.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Custom Design System), Vanilla ES6 JavaScript, Web Speech API |
| **Backend** | Node.js, Express.js, Helmet, CORS, Morgan |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **AI Providers** | Google Gemini API (`@google/genai`), Groq API (`groq-sdk`) |
| **Testing** | Node.js native test runner & E2E API verification suite |

---

## 📁 Project Structure

```
AI-Interview-Preparation-System/
├── database/
│   ├── schema.sql              # Supabase PostgreSQL schema, triggers & RLS policies
│   └── seed_data.sql           # Curated question banks (Aptitude, Tech, Coding, HR)
├── backend/
│   ├── config/
│   │   └── supabase.js         # Supabase client & service role configuration
│   ├── controllers/
│   │   ├── interviewController.js
│   │   ├── aptitudeController.js
│   │   ├── technicalController.js
│   │   ├── codingController.js
│   │   ├── hrController.js
│   │   ├── aiController.js
│   │   └── profileController.js
│   ├── middleware/
│   │   ├── auth.js             # Bearer JWT verification & user extraction
│   │   └── errorHandler.js     # Centralized error handler preventing leakages
│   ├── routes/
│   │   ├── interviewRoutes.js
│   │   ├── aptitudeRoutes.js
│   │   ├── technicalRoutes.js
│   │   ├── codingRoutes.js
│   │   ├── hrRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── profileRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   ├── aiService.js        # Google Gemini & Groq LLM integration
│   │   └── codeExecutionService.js # Safe sandboxed code execution layer
│   ├── utils/
│   │   └── memoryStore.js      # Zero-setup local dev fallback store
│   ├── .env.example
│   ├── package.json
│   ├── server.js               # Main Express application entry point
│   └── test_api.js             # Automated E2E test suite
├── frontend/
│   ├── css/
│   │   ├── global.css          # Design system, CSS variables, typography
│   │   ├── navbar.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── interview.css
│   │   ├── aptitude.css
│   │   ├── technical.css
│   │   ├── coding.css
│   │   ├── hr.css
│   │   ├── report.css
│   │   ├── history.css
│   │   └── profile.css
│   ├── js/
│   │   ├── config.js           # API base URL and role definitions
│   │   ├── toast.js            # Toast notifications
│   │   ├── supabase-client.js  # Supabase Auth integration with local fallback
│   │   ├── api.js              # Centralized fetch client with Auth headers
│   │   ├── navbar.js           # Responsive navigation bar & auth state
│   │   ├── auth.js             # Sign up & login logic
│   │   ├── dashboard.js        # Statistics & recent attempts
│   │   ├── interview.js        # Role selection & round config
│   │   ├── aptitude.js         # Timed MCQ test & palette
│   │   ├── technical.js        # AI dialogue & speech-to-text dictation
│   │   ├── coding.js           # Split IDE, runner & AI review
│   │   ├── hr.js               # Voice recording & STAR feedback
│   │   ├── report.js           # Consolidated final report
│   │   ├── history.js          # Searchable & filterable history
│   │   └── profile.js          # Profile settings & lifetime analytics
│   ├── index.html              # Modern SaaS landing page
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── interview.html
│   ├── aptitude.html
│   ├── technical.html
│   ├── coding.html
│   ├── hr.html
│   ├── report.html
│   ├── history.html
│   └── profile.html
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### 2. Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `backend/.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Credentials (from your Supabase Project Settings > API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key (Get free key at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Database Setup (Supabase PostgreSQL)
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the SQL script from [`database/schema.sql`](file:///C:/Users/bhave/.gemini/antigravity/scratch/AI-Interview-Preparation-System/database/schema.sql) to create tables, triggers, and RLS policies.
3. Run [`database/seed_data.sql`](file:///C:/Users/bhave/.gemini/antigravity/scratch/AI-Interview-Preparation-System/database/seed_data.sql) to populate standard question banks.

### 5. Running the Application
```bash
# Start backend server (serves both API and static frontend)
cd backend
npm start
```
Open your browser and visit **`http://localhost:5000`**.

### 6. Running Automated Tests
```bash
cd backend
node test_api.js
```

---

## 🔒 Security Architecture

1. **Strict Row-Level Security (RLS)**:
   All PostgreSQL tables (`profiles`, `interviews`, `interview_answers`, `interview_results`) enforce `auth.uid() = user_id`. User A cannot view or manipulate User B's interviews.
2. **Backend Bearer Token Verification**:
   The backend extracts `req.headers.authorization` and validates it with Supabase Auth or JWT verification, preventing any client-side `user_id` spoofing.
3. **Safe Code Execution Isolation**:
   Candidate code in the Coding/DSA round is verified through static syntax checks and isolated sandbox simulator connectors rather than arbitrary `eval` on the host machine.
4. **Environment Isolation**:
   No API keys, Gemini tokens, or service-role secrets are exposed to the client-side JavaScript.

---

## 🌐 Deployment Guide

### Deploy Backend (Render / Railway / Fly.io)
1. Set Build Command: `npm install`
2. Set Start Command: `node server.js`
3. Add Environment Variables: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NODE_ENV=production`.

### Deploy Frontend (Vercel / Netlify / Static Host)
1. Publish Directory: `frontend`
2. Update `frontend/js/config.js` with your deployed backend API URL (e.g. `https://your-api.onrender.com/api`).

---

## 🔮 Future-Ready Extension Points
- **Resume-Driven Interviews**: Parsing candidate PDF resumes to tailor domain-specific questions.
- **Containerized Judge0 / Docker Sandboxing**: Plug-in ready via `codeExecutionService.js`.
- **Bidirectional WebSocket Live Audio**: Real-time voice streaming with Gemini Live API.
