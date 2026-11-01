import { Router } from "express";
import { moodHandler, summaryHandler, tempoHandler } from '../controllers/statsController.js';

export const statsRouter = Router();

statsRouter.get('/summary', summaryHandler);
statsRouter.get('/mood', moodHandler);
statsRouter.get('/tempo', tempoHandler);
