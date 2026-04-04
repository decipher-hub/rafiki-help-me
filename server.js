import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donation.js';
import { requireLogin } from './middleware/requireLogin.js';
import upload from './middleware/imageUpload.js';
import { uploadUserAvatar } from './controllers/imageController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.post('/api/me/avatar', requireLogin, upload.single('avatar'), uploadUserAvatar);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err?.message === 'Only image files allowed') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
