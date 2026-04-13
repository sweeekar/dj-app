import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Song } from '../models/song';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'dj.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    bpm REAL NOT NULL,
    duration REAL NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const insertSongStatement = db.prepare(
  'INSERT INTO songs (title, filename, path, bpm, duration, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);

const listSongsStatement = db.prepare('SELECT * FROM songs ORDER BY created_at ASC');

export const insertSong = (song: Omit<Song, 'id' | 'createdAt'>): Song => {
  const createdAt = new Date().toISOString();
  const result = insertSongStatement.run(song.title, song.filename, song.path, song.bpm, song.duration, createdAt);

  return {
    id: Number(result.lastInsertRowid),
    createdAt,
    ...song
  };
};

export const listSongs = (): Song[] => {
  return listSongsStatement.all().map((row: any) => ({
    id: row.id,
    title: row.title,
    filename: row.filename,
    path: row.path,
    bpm: row.bpm,
    duration: row.duration,
    createdAt: row.created_at
  }));
};
