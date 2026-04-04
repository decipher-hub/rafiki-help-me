/**
 * Sequelize CLI config (CommonJS). Used by `npx sequelize-cli db:migrate`.
 * The main app uses ESM in `config/database.js`; keep URLs / credentials in sync via .env.
 */
require('dotenv').config();

function sharedDialectOptions() {
  if (process.env.DB_SSL === 'true') {
    return { ssl: { require: true, rejectUnauthorized: false } };
  }
  return {};
}

function buildConfig() {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: sharedDialectOptions(),
    };
  }

  return {
    username: process.env.DB_USER || process.env.PGUSER || 'postgres',
    password: process.env.DB_PASSWORD ?? process.env.PGPASSWORD ?? '',
    database: process.env.DB_NAME || process.env.PGDATABASE || 'rafiki_help_me',
    host: process.env.DB_HOST || process.env.PGHOST || '127.0.0.1',
    port: process.env.DB_PORT || process.env.PGPORT || 5432,
    dialect: 'postgres',
    dialectOptions: sharedDialectOptions(),
  };
}

const config = buildConfig();

module.exports = {
  development: config,
  test: config,
  production: config,
};
