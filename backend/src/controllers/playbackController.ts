import { Request, Response } from 'express';
import { z } from 'zod';
import { getPlaybackState, next, pause, play, setCrossfade } from '../services/playlistService';

const crossfadeSchema = z.object({
  seconds: z.number().min(2).max(20)
});

export const getState = (_req: Request, res: Response): void => {
  res.json(getPlaybackState());
};

export const startPlayback = (_req: Request, res: Response): void => {
  res.json(play());
};

export const pausePlayback = (_req: Request, res: Response): void => {
  res.json(pause());
};

export const nextTrack = (_req: Request, res: Response): void => {
  res.json(next());
};

export const setCrossfadeDuration = (req: Request, res: Response): void => {
  const parsed = crossfadeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid crossfade duration' });
    return;
  }

  res.json(setCrossfade(parsed.data.seconds));
};
