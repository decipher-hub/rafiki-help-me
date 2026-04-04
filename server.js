import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = Number(process.env.PORT) || 3000;

async function main() {
  await connectDatabase();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
