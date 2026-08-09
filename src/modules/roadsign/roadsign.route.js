import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getRoadSignById, getRoadSigns } from "./roadsign.controller.js";

const RoadSignRouter = Router();

RoadSignRouter.get("/findall", authMiddleware, getRoadSigns);
RoadSignRouter.get("/find/:id", authMiddleware, getRoadSignById);

export default RoadSignRouter;
