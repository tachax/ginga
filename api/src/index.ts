import express from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app:'ginga'});
})

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
})