import { Sequelize } from 'sequelize';

const logging =
  process.env.NODE_ENV === 'development'
    ? (sql) => console.debug('[SQL]', sql)
    : false;

/**
 * Builds a Sequelize instance from DATABASE_URL or discrete PG_* / DB_* env vars.
 */
function createSequelize() {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging,
      dialectOptions:
        process.env.DB_SSL === 'true'
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {},
    });
  }

  const db = process.env.DB_NAME || process.env.PGDATABASE || 'rafiki_help_me';
  const user = process.env.DB_USER || process.env.PGUSER || 'postgres';
  const pass = process.env.DB_PASSWORD ?? process.env.PGPASSWORD ?? '';
  const host = process.env.DB_HOST || process.env.PGHOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || process.env.PGPORT || 5432);

  return new Sequelize(db, user, pass, {
    host,
    port,
    dialect: 'postgres',
    logging,
  });
}

export const sequelize = createSequelize();

/**
 * Verifies DB connectivity and loads Sequelize models.
 * Schema changes are applied with Sequelize migrations (`npm run db:migrate`), not sync().
 */
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL: connection established.');

    await import('../models/index.js');
  } catch (err) {
    console.error('PostgreSQL: unable to connect — check .env and that Postgres is running.');
    console.error(err.message);
    process.exit(1);
  }
}
