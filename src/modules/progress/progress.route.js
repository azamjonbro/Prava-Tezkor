import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getMistakes, getStats, recordAnswer } from "./progress.controller.js";

const ProgressRouter = Router();

ProgressRouter.post("/answer", authMiddleware, recordAnswer);
ProgressRouter.get("/stats", authMiddleware, getStats);
ProgressRouter.get("/mistakes", authMiddleware, getMistakes);

export default ProgressRouter;
