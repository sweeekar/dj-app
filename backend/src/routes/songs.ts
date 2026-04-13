import { Router } from 'express';
import { getSongs } from '../controllers/songController';

const router = Router();
router.get('/', getSongs);

export default router;
