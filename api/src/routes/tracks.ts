import { Router } from 'express';
import { getTrackHandler, listTracksHandler } from '../controllers/tracksController.js';

export const tracksRouter = Router();

tracksRouter.get('/', listTracksHandler);
tracksRouter.get('/:id', getTrackHandler);
