import { Router } from 'express';
import { topGenresHandler } from '../controllers/genresController.js';

export const genresRouter = Router();

genresRouter.get('/top', topGenresHandler);
