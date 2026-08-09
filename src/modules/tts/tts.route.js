import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireProMiddleware from "../../middlewares/require_pro.middleware.js";
import { getSpeech } from "./tts.controller.js";

const TtsRouter = Router();

TtsRouter.get("/:questionId", authMiddleware, requireProMiddleware, getSpeech);

export default TtsRouter;
