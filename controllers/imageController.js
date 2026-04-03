import { promises as fs } from 'fs';
import path from 'path';

export async function uploadUserAvatar(req, res) {
  try {
    const { userId } = req.params;
    const file = req.file; // from multer middleware
    
    const uploadDir = path.join(process.cwd(), 'uploads', 'user-avatars');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filename = `${userId}-${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, filename);
    
    await fs.writeFile(filePath, file.buffer);
    
    res.json({ url: `/uploads/user-avatars/${filename}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}