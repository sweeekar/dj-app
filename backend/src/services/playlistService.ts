import { Song } from '../models/song';
import { buildTransitionPlan, detectLoopWindow, TransitionPlan } from './mixEngine';

interface PlaybackState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  crossfadeSeconds: number;
  transitionPlan: TransitionPlan | null;
  loopWindow: { start: number; end: number } | null;
}

const playbackState: PlaybackState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  crossfadeSeconds: 8,
  transitionPlan: null,
  loopWindow: null
};

export const setQueue = (songs: Song[]): PlaybackState => {
  playbackState.queue = songs;
  if (playbackState.currentIndex >= songs.length) {
    playbackState.currentIndex = songs.length - 1;
  }
  return getPlaybackState();
};

export const getPlaybackState = (): PlaybackState => {
  const currentSong = playbackState.queue[playbackState.currentIndex];
  const nextSong = playbackState.queue[playbackState.currentIndex + 1];

  if (currentSong && nextSong) {
    playbackState.transitionPlan = buildTransitionPlan(
      currentSong,
      nextSong,
      playbackState.crossfadeSeconds
    );
  } else {
    playbackState.transitionPlan = null;
  }

  playbackState.loopWindow = currentSong ? detectLoopWindow(currentSong.duration) : null;

  return {
    ...playbackState,
    queue: [...playbackState.queue],
    transitionPlan: playbackState.transitionPlan ? { ...playbackState.transitionPlan } : null,
    loopWindow: playbackState.loopWindow ? { ...playbackState.loopWindow } : null
  };
};

export const play = (): PlaybackState => {
  if (playbackState.queue.length > 0 && playbackState.currentIndex === -1) {
    playbackState.currentIndex = 0;
  }
  playbackState.isPlaying = playbackState.currentIndex >= 0;
  return getPlaybackState();
};

export const pause = (): PlaybackState => {
  playbackState.isPlaying = false;
  return getPlaybackState();
};

export const next = (): PlaybackState => {
  if (playbackState.currentIndex < playbackState.queue.length - 1) {
    playbackState.currentIndex += 1;
    playbackState.isPlaying = true;
  } else {
    playbackState.isPlaying = false;
  }
  return getPlaybackState();
};

export const setCrossfade = (seconds: number): PlaybackState => {
  playbackState.crossfadeSeconds = Math.max(2, Math.min(20, seconds));
  return getPlaybackState();
};
