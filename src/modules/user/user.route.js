import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  getProfile,
  updateUser,
  inviteUser,
  CreateFee,
  UpdatePaid,
} from "./user.controller.js";
import { validate } from "../../middlewares/validation.middleware.js";
import UpdateuserSchema from "./dto/update-user.dto.js";
import CreateFeeDto from "./dto/create-fee.dto.js";
import IsAdminMiddlware from "../../middlewares/is_admin.middleware.js";

const UserRouter = Router();

UserRouter.get("/profile", authMiddleware, getProfile);
UserRouter.put(
  "/update",
  authMiddleware,
  validate(UpdateuserSchema),
  updateUser
);
UserRouter.post("/invite", authMiddleware, inviteUser);
UserRouter.post(
  "/create/fee",
  authMiddleware,
  validate(CreateFeeDto),
  CreateFee
);
UserRouter.patch(
  "/fee/:userId/:moneyId",
  authMiddleware,
  IsAdminMiddlware,
  UpdatePaid
);

export default UserRouter;
