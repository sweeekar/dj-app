export interface Song {
  id: number;
  title: string;
  filename: string;
  path: string;
  bpm: number;
  duration: number;
  createdAt: string;
}

export interface UploadAnalysis {
  bpm: number;
  duration: number;
  beats: number[];
  loopCandidates: Array<{ start: number; end: number }>;
  spectralCentroid: number;
}
