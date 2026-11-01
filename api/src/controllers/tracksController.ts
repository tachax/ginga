import type { Request, Response } from 'express';
import { SORT_COLUMNS, listTracks, type SortColumn } from '../services/tracksService.js';

function isSortColumn(value: string): value is SortColumn {
  return (SORT_COLUMNS as readonly string[]).includes(value);
}

export async function listTracksHandler(req: Request, res: Response) {
  const sortParam = String(req.query.sort ?? '-danceability');
  const desc = sortParam.startsWith('-');
  const sort = desc ? sortParam.slice(1) : sortParam;
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);

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

  const result = await listTracks({ sort, desc, page, pageSize });
  res.json(result);
}
