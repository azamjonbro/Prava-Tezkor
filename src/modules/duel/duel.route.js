import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { createDuel, fillWithBots, finishDuel, getDuel, getOpenDuels, joinDuel } from "./duel.controller.js";

const DuelRouter = Router();

DuelRouter.post("/create", authMiddleware, createDuel);
DuelRouter.get("/open", authMiddleware, getOpenDuels);
DuelRouter.post("/:code/join", authMiddleware, joinDuel);
DuelRouter.post("/:code/bot", authMiddleware, fillWithBots);
DuelRouter.get("/:code", authMiddleware, getDuel);
DuelRouter.post("/:code/finish", authMiddleware, finishDuel);

export default DuelRouter;
