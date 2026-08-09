import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getTop } from "./leaderboard.controller.js";

const LeaderboardRouter = Router();

LeaderboardRouter.get("/top", authMiddleware, getTop);

export default LeaderboardRouter;
