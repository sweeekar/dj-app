import { Request, Response } from 'express';
import { listSongs } from '../utils/db';
import { setQueue } from '../services/playlistService';

export const getSongs = (_req: Request, res: Response): void => {
  const songs = listSongs();
  setQueue(songs);
  res.json({ songs });
};
