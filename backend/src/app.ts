import express from 'express';
import cors from 'cors';
import path from 'path';
import uploadRoutes from './routes/upload';
import songsRoutes from './routes/songs';
import playbackRoutes from './routes/playback';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/upload', uploadRoutes);
  app.use('/api/songs', songsRoutes);
  app.use('/api/playback', playbackRoutes);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(400).json({ error: err.message });
  });

  return app;
};
