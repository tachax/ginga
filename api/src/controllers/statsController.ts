import type { Request, Response } from "express";
import { getMoodSample, getSummary, getTempoHistogram } from '../services/statsService.js';

export async function summaryHandler(_req: Request, res: Response) {
  const summary = await getSummary();
  res.json(summary);
}

export async function moodHandler(req: Request, res: Response) {
  const sample = Number(req.query.sample ?? 300);

  if (!Number.isInteger(sample) || sample < 30 || sample > 900) {
    res.status(400).json({ error: 'sample must be an integer between 30 and 900' });
    return;
  }

  const points = await getMoodSample(Math.floor(sample / 4));
  res.json(points);
}

export async function tempoHandler(_req: Request, res: Response) {
  const bins = await getTempoHistogram();
  res.json(bins);
}
