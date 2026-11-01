import express from 'express';
import { pool } from './db.js';
import { statsRouter } from './routes/stats.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get('/api/health', async (_req, res) => {
  const { rows } = await pool.query('SELECT NOW() AS now');
  res.json({ ok: true, dbTime: rows[0].now});
})

app.use('/api/stats', statsRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
})