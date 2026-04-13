import { Router } from 'express';
import {
  getState,
  nextTrack,
  pausePlayback,
  setCrossfadeDuration,
  startPlayback
} from '../controllers/playbackController';

const router = Router();

router.get('/state', getState);
router.post('/play', startPlayback);
router.post('/pause', pausePlayback);
router.post('/next', nextTrack);
router.post('/crossfade', setCrossfadeDuration);

export default router;
