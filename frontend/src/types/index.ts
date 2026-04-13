export interface Song {
  id: number;
  title: string;
  filename: string;
  path: string;
  bpm: number;
  duration: number;
  createdAt: string;
}

export interface TransitionPlan {
  fromSongId: number;
  toSongId: number;
  tempoAdjustPercent: number;
  eqLowGain: number;
  eqMidGain: number;
  eqHighGain: number;
  crossfadeDurationMs: number;
}

export interface PlaybackState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  crossfadeSeconds: number;
  transitionPlan: TransitionPlan | null;
  loopWindow: { start: number; end: number } | null;
}
