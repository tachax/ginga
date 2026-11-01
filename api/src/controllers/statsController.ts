import type { Request, Response } from "express";
import { getSummary } from "../services/statsService.js";

export async function summaryHandler(_req: Request, res: Response) {
  const summary = await getSummary();
  res.json(summary);
}