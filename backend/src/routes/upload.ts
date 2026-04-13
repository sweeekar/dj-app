import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadSong } from '../controllers/uploadController';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    cb(null, safeName);
  }
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/aac', 'audio/flac'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Unsupported audio file type'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 40 * 1024 * 1024 }
});

const router = Router();
router.post('/', upload.single('song'), uploadSong);

export default router;
