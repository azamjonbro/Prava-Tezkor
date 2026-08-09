import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getCategories } from "./category.controller.js";

const CategoryRouter = Router();

CategoryRouter.get("/findall", authMiddleware, getCategories);

export default CategoryRouter;
