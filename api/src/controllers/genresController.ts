import type { Request, Response } from 'express';
import { METRICS, compareGenres, getTopGenres, type Metric } from '../services/genresService.js';

function isMetric(value: unknown): value is Metric {
  return typeof value === 'string' && (METRICS as readonly string[]).includes(value);
}

export async function topGenresHandler(req: Request, res: Response) {
  const metric = req.query.metric ?? 'danceability';
  const limit = Number(req.query.limit ?? 8);

  if (!isMetric(metric)) {
    res.status(400).json({ error: `metric must be one of: ${METRICS.join(', ')}` });
    return;
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    res.status(400).json({ error: 'limit must be an integer between 1 and 50' });
    return;
  }

  const genres = await getTopGenres(metric, limit);
  res.json(genres);
}

export async function compareHandler(req: Request, res: Response) {
  const a = req.query.a ?? 'samba';
  const b = req.query.b ?? 'tango';

  if (typeof a !== 'string' || typeof b !== 'string') {
    res.status(400).json({ error: 'a and b must be single genre names' });
    return;
  }

  const profiles = await compareGenres(a, b);
  const first = profiles.find((p => p.genre === a)); 
  const second = profiles.find((p => p.genre === b)); 

  if (!first || !second) {
    res.status(404).json({ error: `genre not found: ${first ? b : a}` });
    return;
  }

  res.json([first, second]);
}