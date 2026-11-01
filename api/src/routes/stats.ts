import { Router } from "express";
import { summaryHandler } from "../controllers/statsController.js";

export const statsRouter = Router();

statsRouter.get('/summary', summaryHandler);