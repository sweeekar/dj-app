import type { PlaybackState } from '../types';

interface PlayerProps {
  state: PlaybackState;
  onPlay: () => Promise<void>;
  onPause: () => Promise<void>;
  onNext: () => Promise<void>;
  onCrossfadeChange: (seconds: number) => Promise<void>;
}

export const Player = ({ state, onPlay, onPause, onNext, onCrossfadeChange }: PlayerProps) => {
  const currentSong = state.queue[state.currentIndex];

  return (
    <div className="panel">
      <h2>Auto DJ</h2>
      <p>{currentSong ? `Now playing: ${currentSong.title} (${currentSong.bpm.toFixed(1)} BPM)` : 'Waiting for songs...'}</p>
      <div className="controls">
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={onNext}>Skip</button>
      </div>
      <label>
        Crossfade ({state.crossfadeSeconds}s)
        <input
          type="range"
          min={2}
          max={20}
          value={state.crossfadeSeconds}
          onChange={(event) => onCrossfadeChange(Number(event.target.value))}
        />
      </label>
      {state.transitionPlan && (
        <div className="transition">
          <p>Tempo adjust: {state.transitionPlan.tempoAdjustPercent}%</p>
          <p>
            EQ automation: L {state.transitionPlan.eqLowGain} / M {state.transitionPlan.eqMidGain} / H{' '}
            {state.transitionPlan.eqHighGain}
          </p>
        </div>
      )}
      {state.loopWindow && (
        <p>
          Loop recommendation: {state.loopWindow.start}s → {state.loopWindow.end}s
        </p>
      )}
    </div>
  );
};
