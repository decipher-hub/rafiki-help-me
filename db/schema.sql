-- Optional reference DDL for PostgreSQL.
-- Preferred: apply schema with Sequelize migrations — `npm run db:migrate`
-- Manual:     createdb rafiki_help_me && psql -U postgres -d rafiki_help_me -f db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(255) NOT NULL CHECK (payment_method IN ('mpesa', 'bank')),
  message TEXT,
  photo_url VARCHAR(512),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
