import type { Request, Response } from 'express';
import { SORT_COLUMNS, listTracks, type SortColumn } from '../services/tracksService.js';

function isSortColumn(value: string): value is SortColumn {
  return (SORT_COLUMNS as readonly string[]).includes(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

export async function listTracksHandler(req: Request, res: Response) {
  const sortParam = String(req.query.sort ?? '-danceability');
  const desc = sortParam.startsWith('-');
  const sort = desc ? sortParam.slice(1) : sortParam;
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);

  const genre = optionalString(req.query.genre);
  const q = optionalString(req.query.q);
  const minDance = req.query.minDance === undefined ? undefined : Number(req.query.minDance);
  const explicitParam = req.query.explicit;
  const explicit = explicitParam === 'true' ? true : explicitParam === 'false' ? false : undefined;

  if (!isSortColumn(sort)) {
    res.status(400).json({ error: `sort must be one of: ${SORT_COLUMNS.join(', ')} (prefix with - for descending)` });
    return;
  }
  if (!Number.isInteger(page) || page < 1) {
    res.status(400).json({ error: 'page must be a positive integer' });
    return;
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50) {
    res.status(400).json({ error: 'pageSize must be an integer between 1 and 50' });
    return;
  }
  if (minDance !== undefined && (Number.isNaN(minDance) || minDance < 0 || minDance > 1)) {
    res.status(400).json({ error: 'minDance must be a number between 0 and 1' });
    return;
  }
  if (explicitParam !== undefined && explicit === undefined) {
    res.status(400).json({ error: 'explicit must be true or false' });
    return;
  }
  if (q && q.length > 100) {
    res.status(400).json({ error: 'q must be at most 100 characters' });
    return;
  }

  const result = await listTracks({ sort, desc, page, pageSize, genre, minDance, explicit, q });
  res.json(result);
}
