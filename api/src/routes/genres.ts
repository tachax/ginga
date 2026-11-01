import { Router } from 'express';
import { compareHandler, topGenresHandler } from '../controllers/genresController.js';

export const genresRouter = Router();

genresRouter.get('/top', topGenresHandler);
genresRouter.get('/compare', compareHandler);
