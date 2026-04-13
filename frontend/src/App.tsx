import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import { Player } from './components/Player';
import { Playlist } from './components/Playlist';
import { Upload } from './components/Upload';
import { Visualizer } from './components/Visualizer';
import { useAudioEngine } from './hooks/useAudioEngine';
import { getApiUrl, getSongs, next, pause, play, setCrossfade } from './services/api';
import type { PlaybackState, Song } from './types';

const emptyState: PlaybackState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  crossfadeSeconds: 8,
  transitionPlan: null,
  loopWindow: null
};

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [state, setState] = useState<PlaybackState>(emptyState);
  const [error, setError] = useState('');
  const { analyser, loadAndPlay } = useAudioEngine();

  const socketUrl = useMemo(() => getApiUrl(), []);

  const refreshSongs = async (): Promise<void> => {
    const loadedSongs = await getSongs();
    setSongs(loadedSongs);
    setState((previous) => ({ ...previous, queue: loadedSongs }));
  };

  useEffect(() => {
    let mounted = true;
    getSongs()
      .then((loadedSongs) => {
        if (!mounted) return;
        setSongs(loadedSongs);
        setState((previous) => ({ ...previous, queue: loadedSongs }));
      })
      .catch(() => {
        if (mounted) {
          setError('Unable to load songs');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const socket: Socket = io(socketUrl);
    socket.on('playback:update', (incomingState: PlaybackState) => {
      setState(incomingState);
    });

    return () => {
      socket.disconnect();
    };
  }, [socketUrl]);

  const currentSong = state.queue[state.currentIndex];

  useEffect(() => {
    if (!currentSong || !state.isPlaying) {
      return;
    }

    const playbackRate = state.transitionPlan
      ? 1 + state.transitionPlan.tempoAdjustPercent / 100
      : 1;

    loadAndPlay(`${socketUrl}${currentSong.path}`, playbackRate).catch(() => {
      setError('Playback failed. Check browser autoplay permissions.');
    });
  }, [currentSong, state.isPlaying, state.transitionPlan, loadAndPlay, socketUrl]);

  useEffect(() => {
    if (songs.length > 0 && !state.isPlaying && state.currentIndex === -1) {
      play().then(setState).catch(() => undefined);
    }
  }, [songs.length, state.isPlaying, state.currentIndex]);

  return (
    <main>
      <header>
        <h1>Autopilot DJ App</h1>
        <p>Upload songs and let BPM sync, crossfading, EQ automation, and looping run automatically.</p>
      </header>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <Upload onUploaded={refreshSongs} />
        <Player
          state={state}
          onPlay={async () => setState(await play())}
          onPause={async () => setState(await pause())}
          onNext={async () => setState(await next())}
          onCrossfadeChange={async (seconds) => setState(await setCrossfade(seconds))}
        />
      </div>
      <Visualizer analyser={analyser} />
      <Playlist songs={songs} currentIndex={state.currentIndex} />
    </main>
  );
}

export default App;
