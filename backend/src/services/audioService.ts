import axios from 'axios';
import { UploadAnalysis } from '../models/song';

const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL || 'http://localhost:8000';

const defaultAnalysis: UploadAnalysis = {
  bpm: 120,
  duration: 0,
  beats: [],
  loopCandidates: [],
  spectralCentroid: 0
};

export const analyzeSong = async (filePath: string): Promise<UploadAnalysis> => {
  try {
    const response = await axios.post(`${AUDIO_SERVICE_URL}/analyze`, { filePath }, { timeout: 20_000 });
    return { ...defaultAnalysis, ...response.data };
  } catch {
    return defaultAnalysis;
  }
};
