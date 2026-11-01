import { Router } from 'express';
import { compareHandler, listGenresHandler, topGenresHandler } from '../controllers/genresController.js';

export const genresRouter = Router();

genresRouter.get('/top', topGenresHandler);
genresRouter.get('/compare', compareHandler);
genresRouter.get('/', listGenresHandler);
