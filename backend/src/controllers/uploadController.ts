import { Request, Response } from 'express';
import path from 'path';
import { analyzeSong } from '../services/audioService';
import { insertSong, listSongs } from '../utils/db';
import { setQueue } from '../services/playlistService';

export const uploadSong = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'Audio file is required' });
    return;
  }

  const analysis = await analyzeSong(req.file.path);
  const song = insertSong({
    title: path.parse(req.file.originalname).name,
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    bpm: analysis.bpm,
    duration: analysis.duration
  });

  setQueue(listSongs());

  res.status(201).json({
    song,
    analysis
  });
};
