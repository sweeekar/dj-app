import type { Song } from '../types';

interface PlaylistProps {
  songs: Song[];
  currentIndex: number;
}

export const Playlist = ({ songs, currentIndex }: PlaylistProps) => {
  return (
    <div className="panel">
      <h2>Playlist queue</h2>
      <ul className="playlist">
        {songs.map((song, index) => (
          <li key={song.id} className={index === currentIndex ? 'active' : ''}>
            <div>
              <strong>{song.title}</strong>
              <span>{song.bpm.toFixed(1)} BPM</span>
            </div>
            <small>{Math.round(song.duration)}s</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
