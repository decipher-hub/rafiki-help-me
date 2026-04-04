import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donation.js';
import { requireLogin } from './middleware/requireLogin.js';
import upload from './middleware/imageUpload.js';
import { uploadUserAvatar } from './controllers/imageController.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Express application factory — no listen() here (that stays in server.js).
 */
export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'rafiki-help-me' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/donations', donationRoutes);
  app.post('/api/me/avatar', requireLogin, upload.single('avatar'), uploadUserAvatar);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
