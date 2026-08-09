import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import IsAdminMiddlware from "../../middlewares/is_admin.middleware.js";
import {
  CreateEarnMoeny,
  DeleteEarnMoneyById,
  getEarnMoney,
  getEarnMoneyById,
  updateEarnMoneyById,
} from "./controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import CreateEarnMoneyDto from "./dto/create.js";
import UpdateEarnMoneyDto from "./dto/update.js";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  IsAdminMiddlware,
  validate(CreateEarnMoneyDto),
  CreateEarnMoeny
);
router.get("/findall", authMiddleware, getEarnMoney);
router.get("/:id", authMiddleware, getEarnMoneyById);
router.put(
  "/:id",
  authMiddleware,
  IsAdminMiddlware,
  validate(UpdateEarnMoneyDto),
  updateEarnMoneyById
);
router.delete(
  "/:id",
  authMiddleware,
  IsAdminMiddlware,
  DeleteEarnMoneyById
);

export default router;
