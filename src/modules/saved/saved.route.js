import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getSavedQuestions, toggleSaved } from "./saved.controller.js";

const SavedRouter = Router();

SavedRouter.get("/", authMiddleware, getSavedQuestions);
SavedRouter.post("/:questionId/toggle", authMiddleware, toggleSaved);

export default SavedRouter;
