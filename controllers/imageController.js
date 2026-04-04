import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User.js';

export async function uploadUserAvatar(req, res) {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image file (use field name "avatar")' });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'user-avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${userId}-${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);

    const publicUrl = `/uploads/user-avatars/${filename}`;
    await User.setUserAvatarUrl(userId, publicUrl);

    res.json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
