import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

async function runMigration() {
    console.log('🚀 Running Supabase PostgreSQL Schema Migration...');

    if (!dbUrl) {
        console.log('\nℹ️  Notice: Direct PostgreSQL connection string (DATABASE_URL) is not set in backend/.env.');
        console.log('👉 Quick 1-Click Setup:');
        console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/fndwiwualrquwilfntmt/sql');
        console.log('2. Copy & paste the SQL from database/schema.sql and database/seed_data.sql');
        console.log('3. Click "RUN". All tables, triggers & RLS policies will be instantly created in your database!');
        return;
    }

    const client = new pg.Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log(' Connected directly to Supabase PostgreSQL Database!');

        const schemaSql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf-8');
        const seedSql = fs.readFileSync(path.join(__dirname, '../../database/seed_data.sql'), 'utf-8');

        console.log('📝 Creating tables, triggers and RLS policies...');
        await client.query(schemaSql);
        console.log('✅ Schema created successfully.');

        console.log('🌱 Populating initial question banks...');
        await client.query(seedSql);
        console.log('✅ Question banks seeded successfully.');

        console.log('\n🎉 Supabase Database Migration Complete! All tables are live.');
    } catch (err) {
        console.error('❌ Migration error:', err.message);
    } finally {
        await client.end();
    }
}

runMigration();
