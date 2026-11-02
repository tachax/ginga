import { Router } from 'express';
import {
  compareHandler,
  genreProfileHandler,
  listGenresHandler,
  topGenresHandler,
} from '../controllers/genresController.js';

export const genresRouter = Router();

// Fixed paths first: '/:name' would otherwise capture 'top' and 'compare'.
genresRouter.get('/top', topGenresHandler);
genresRouter.get('/compare', compareHandler);
genresRouter.get('/', listGenresHandler);
genresRouter.get('/:name', genreProfileHandler);
