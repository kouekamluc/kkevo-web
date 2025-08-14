-- Initialize KKEVO database
-- This file is automatically executed when the PostgreSQL container starts

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE kkevo_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kkevo_db')\gexec

-- Connect to the database
\c kkevo_db;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE kkevo_db TO kkevo_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO kkevo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kkevo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kkevo_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO kkevo_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO kkevo_user;
