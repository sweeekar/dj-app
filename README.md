# DJ App

Automated DJ mixing app where users upload tracks and the system handles BPM detection, queueing, beat-aware transitions, looping hints, EQ automation, and crossfading.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Node.js + Express + Socket.io + SQLite
- **Audio Analysis Service**: Python + librosa
- **Deployment**: Docker Compose

## Features

- Auto BPM detection via librosa microservice
- Upload API with audio-type validation and local file storage
- Playlist queue persisted in SQLite
- Playback state engine with:
  - tempo adjustment guidance
  - loop window recommendations
  - EQ automation suggestions
  - configurable crossfade duration
- Real-time visualizer (frequency bars + waveform) powered by Web Audio API
- Live playback-state updates via Socket.io

## Project Structure

```
dj-app/
├── frontend/
├── backend/
├── audio-service/
├── docker-compose.yml
└── README.md
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Audio Service

```bash
cd audio-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

## One-command Docker startup

```bash
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Audio Service: http://localhost:8000

## API Overview

- `POST /api/upload` - upload file field `song`
- `GET /api/songs` - list uploaded songs
- `GET /api/playback/state` - current playback/transition state
- `POST /api/playback/play` - start playback
- `POST /api/playback/pause` - pause playback
- `POST /api/playback/next` - move to next track
- `POST /api/playback/crossfade` - set `{ "seconds": number }`

## Notes

- Uploading songs is the only required user interaction.
- Playback automation uses transition plans from detected BPM and queue order.
- For best autoplay behavior, users may need one initial browser interaction due to browser media policies.
