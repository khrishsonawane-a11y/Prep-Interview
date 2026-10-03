-- =========================================================================
-- AI INTERVIEW PREPARATION SYSTEM - SUPABASE POSTGRESQL SCHEMA
-- =========================================================================
-- This script creates all required tables, constraints, indexes, triggers,
-- and Row Level Security (RLS) policies for complete user data isolation.
-- =========================================================================

-- Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    target_role TEXT DEFAULT 'Software Developer',
    experience_level TEXT DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 2. INTERVIEWS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- e.g. 'Software Developer', 'Full Stack Developer', etc.
    difficulty TEXT NOT NULL DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    total_rounds INTEGER NOT NULL DEFAULT 4,
    current_round_index INTEGER NOT NULL DEFAULT 0,
    rounds_config JSONB NOT NULL DEFAULT '["aptitude", "technical", "coding", "hr"]'::jsonb,
    overall_score NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_role ON public.interviews(role);

-- -------------------------------------------------------------------------
-- 3. QUESTION BANKS (Reference & Seedable Tables)
-- -------------------------------------------------------------------------

-- 3.1 Aptitude Questions
CREATE TABLE IF NOT EXISTS public.aptitude_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- Quantitative, Logical Reasoning, Verbal, Data Interpretation
    topic TEXT NOT NULL, -- Percentages, Profit and Loss, Number Systems, Time and Work, etc.
    difficulty TEXT NOT NULL DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced, Frequently Asked
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- ["A) ...", "B) ...", "C) ...", "D) ..."]
    correct_option INTEGER NOT NULL, -- Index 0..3
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.2 Technical Questions
CREATE TABLE IF NOT EXISTS public.technical_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL, -- Software Developer, Full Stack, Python Developer, etc.
    topic TEXT NOT NULL, -- OOP, DBMS, SQL, Computer Networks, OS, DSA, APIs
    difficulty TEXT NOT NULL DEFAULT 'Intermediate',
    question TEXT NOT NULL,
    expected_concepts JSONB DEFAULT '[]'::jsonb, -- Key concepts required in good answer
    sample_answer TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.3 Coding / DSA Questions
CREATE TABLE IF NOT EXISTS public.coding_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Software Developer',
    topic TEXT NOT NULL, -- Arrays, Strings, Trees, Dynamic Programming, etc.
    difficulty TEXT NOT NULL DEFAULT 'Intermediate',
    description TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{input, output, explanation}]
    constraints TEXT[] DEFAULT ARRAY[]::TEXT[],
    starter_code JSONB NOT NULL DEFAULT '{"javascript": "// write solution", "python": "# write solution"}'::jsonb,
    test_cases JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{input, expected_output, is_hidden: false}]
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3.4 HR / Behavioral Questions
CREATE TABLE IF NOT EXISTS public.hr_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL DEFAULT 'General HR', -- Behavioral, Situational, Motivational, Leadership
    question TEXT NOT NULL,
    key_evaluation_points JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- -------------------------------------------------------------------------
-- 4. INTERVIEW ANSWERS & ATTEMPTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    round_type TEXT NOT NULL, -- 'aptitude', 'technical', 'coding', 'hr'
    question_id TEXT, -- UUID or AI-generated question identifier
    question_text TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    code_language TEXT, -- For coding round (javascript, python, java, cpp)
    is_correct BOOLEAN, -- For aptitude/objective evaluations
    score NUMERIC(5, 2) DEFAULT 0, -- Score out of 100
    ai_evaluation JSONB DEFAULT '{}'::jsonb, -- { correctness, relevance, clarity, missing_points, feedback, improvement }
    time_taken_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interview_answers_interview_id ON public.interview_answers(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_user_id ON public.interview_answers(user_id);

-- -------------------------------------------------------------------------
-- 5. INTERVIEW RESULTS & FINAL FEEDBACK
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interview_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL UNIQUE REFERENCES public.interviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    overall_summary TEXT NOT NULL,
    aptitude_summary JSONB DEFAULT '{"score": 0, "strengths": [], "improvements": []}'::jsonb,
    technical_summary JSONB DEFAULT '{"score": 0, "strengths": [], "improvements": []}'::jsonb,
    coding_summary JSONB DEFAULT '{"score": 0, "strengths": [], "improvements": []}'::jsonb,
    hr_summary JSONB DEFAULT '{"score": 0, "strengths": [], "improvements": []}'::jsonb,
    recommended_topics JSONB DEFAULT '[]'::jsonb, -- [{ topic: 'DBMS', reason: '...' }]
    readiness_rating TEXT DEFAULT 'Developing', -- Ready, Nearly Ready, Developing, Needs Improvement
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interview_results_user_id ON public.interview_results(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_results_interview_id ON public.interview_results(interview_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all sensitive user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_results ENABLE ROW LEVEL SECURITY;

-- Question banks are readable by any authenticated user, modifiable only by service role
ALTER TABLE public.aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_questions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Interviews Policies (CRITICAL: User isolation)
DROP POLICY IF EXISTS "Users can view own interviews" ON public.interviews;
CREATE POLICY "Users can view own interviews" 
    ON public.interviews FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own interviews" ON public.interviews;
CREATE POLICY "Users can create own interviews" 
    ON public.interviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interviews" ON public.interviews;
CREATE POLICY "Users can update own interviews" 
    ON public.interviews FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own interviews" ON public.interviews;
CREATE POLICY "Users can delete own interviews" 
    ON public.interviews FOR DELETE 
    USING (auth.uid() = user_id);

-- 3. Interview Answers Policies
DROP POLICY IF EXISTS "Users can view own answers" ON public.interview_answers;
CREATE POLICY "Users can view own answers" 
    ON public.interview_answers FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own answers" ON public.interview_answers;
CREATE POLICY "Users can insert own answers" 
    ON public.interview_answers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 4. Interview Results Policies
DROP POLICY IF EXISTS "Users can view own results" ON public.interview_results;
CREATE POLICY "Users can view own results" 
    ON public.interview_results FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own results" ON public.interview_results;
CREATE POLICY "Users can insert own results" 
    ON public.interview_results FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 5. Public / Authenticated Read Policies for Question Banks
DROP POLICY IF EXISTS "Authenticated users can read aptitude questions" ON public.aptitude_questions;
CREATE POLICY "Authenticated users can read aptitude questions" 
    ON public.aptitude_questions FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can read technical questions" ON public.technical_questions;
CREATE POLICY "Authenticated users can read technical questions" 
    ON public.technical_questions FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can read coding questions" ON public.coding_questions;
CREATE POLICY "Authenticated users can read coding questions" 
    ON public.coding_questions FOR SELECT 
    TO authenticated 
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can read hr questions" ON public.hr_questions;
CREATE POLICY "Authenticated users can read hr questions" 
    ON public.hr_questions FOR SELECT 
    TO authenticated 
    USING (true);
