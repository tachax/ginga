import { Router } from 'express';
import { listTracksHandler } from '../controllers/tracksController.js';

export const tracksRouter = Router();

tracksRouter.get('/', listTracksHandler);
