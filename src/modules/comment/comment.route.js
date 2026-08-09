import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import requireProMiddleware from "../../middlewares/require_pro.middleware.js";
import { createComment, listComments } from "./comment.controller.js";

const CommentRouter = Router();

CommentRouter.get("/:questionId", authMiddleware, requireProMiddleware, listComments);
CommentRouter.post("/:questionId", authMiddleware, requireProMiddleware, createComment);

export default CommentRouter;
