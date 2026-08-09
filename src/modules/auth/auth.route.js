import { Router } from "express";
import { validate } from "../../middlewares/validation.middleware.js";
import loginSchema from "./dto/login-auth.dto.js";
import { Login, SignUp, TelegramLogin } from "./auth.controller.js";
import SignUpSchema from "./dto/signup-auht.dto.js";
import TelegramAuthSchema from "./dto/telegram-auth.dto.js";

const AuthRouter = Router();

AuthRouter.post("/login", validate(loginSchema), Login);
AuthRouter.post("/signup", validate(SignUpSchema), SignUp);
AuthRouter.post("/telegram", validate(TelegramAuthSchema), TelegramLogin);

export default AuthRouter;
