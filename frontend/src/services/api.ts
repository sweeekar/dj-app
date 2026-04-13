import type { PlaybackState, Song } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getSongs = async (): Promise<Song[]> => {
  const response = await fetch(`${API_URL}/api/songs`);
  if (!response.ok) {
    throw new Error('Failed to load songs');
  }
  const data = await response.json();
  return data.songs;
};

export const uploadSong = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('song', file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Upload failed');
  }
};

export const play = async (): Promise<PlaybackState> => {
  const response = await fetch(`${API_URL}/api/playback/play`, { method: 'POST' });
  return response.json();
};

export const pause = async (): Promise<PlaybackState> => {
  const response = await fetch(`${API_URL}/api/playback/pause`, { method: 'POST' });
  return response.json();
};

export const next = async (): Promise<PlaybackState> => {
  const response = await fetch(`${API_URL}/api/playback/next`, { method: 'POST' });
  return response.json();
};

export const setCrossfade = async (seconds: number): Promise<PlaybackState> => {
  const response = await fetch(`${API_URL}/api/playback/crossfade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seconds })
  });
  return response.json();
};

export const getApiUrl = (): string => API_URL;
