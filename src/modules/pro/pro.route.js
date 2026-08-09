import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import IsAdminMiddlware from "../../middlewares/is_admin.middleware.js";
import { adminApprove, adminListRequests, adminReject, createRequest, getStatus } from "./pro.controller.js";

const ProRouter = Router();

ProRouter.get("/status", authMiddleware, getStatus);
ProRouter.post("/request", authMiddleware, createRequest);

ProRouter.get("/requests", authMiddleware, IsAdminMiddlware, adminListRequests);
ProRouter.post("/requests/:id/approve", authMiddleware, IsAdminMiddlware, adminApprove);
ProRouter.post("/requests/:id/reject", authMiddleware, IsAdminMiddlware, adminReject);

export default ProRouter;
