import express from 'express';
import { pool } from './db.js';
import { statsRouter } from './routes/stats.js';
import { genresRouter } from './routes/genres.js';
import { tracksRouter } from './routes/tracks.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get('/api/health', async (_req, res) => {
  const { rows } = await pool.query('SELECT NOW() AS now');
  res.json({ ok: true, dbTime: rows[0].now});
})

app.use('/api/stats', statsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/tracks', tracksRouter);


app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
})