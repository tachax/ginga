import { Router } from "express";
import { moodHandler, summaryHandler } from '../controllers/statsController.js';

export const statsRouter = Router();

statsRouter.get('/summary', summaryHandler);
statsRouter.get('/mood', moodHandler);
