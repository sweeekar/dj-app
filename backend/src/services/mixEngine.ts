import { Song } from '../models/song';

export interface TransitionPlan {
  fromSongId: number;
  toSongId: number;
  tempoAdjustPercent: number;
  eqLowGain: number;
  eqMidGain: number;
  eqHighGain: number;
  crossfadeDurationMs: number;
}

export const computeTempoAdjustPercent = (fromBpm: number, toBpm: number): number => {
  if (fromBpm <= 0 || toBpm <= 0) {
    return 0;
  }

  const raw = ((toBpm - fromBpm) / fromBpm) * 100;
  return Math.max(-8, Math.min(8, Number(raw.toFixed(2))));
};

export const detectLoopWindow = (duration: number): { start: number; end: number } => {
  const loopLength = Math.min(16, Math.max(4, Math.floor(duration / 12)));
  return {
    start: Math.max(0, Math.floor(duration / 3)),
    end: Math.max(loopLength, Math.floor(duration / 3) + loopLength)
  };
};

export const buildTransitionPlan = (current: Song, next: Song, crossfadeSeconds: number): TransitionPlan => {
  const tempoAdjustPercent = computeTempoAdjustPercent(current.bpm, next.bpm);
  const energyDelta = next.bpm - current.bpm;

  return {
    fromSongId: current.id,
    toSongId: next.id,
    tempoAdjustPercent,
    eqLowGain: energyDelta > 5 ? -1.5 : -0.5,
    eqMidGain: energyDelta > 5 ? 0.5 : 0,
    eqHighGain: energyDelta > 5 ? 1.5 : 0.75,
    crossfadeDurationMs: Math.max(2000, crossfadeSeconds * 1000)
  };
};
