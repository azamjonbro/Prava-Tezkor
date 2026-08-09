import UserModel from "../user/user.model.js";
import { verify } from "argon2";
import jwt from "jsonwebtoken";
import { verifyTelegramInitData } from "../../utils/telegramAuth.js";

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const oldUser = await UserModel.findOne({ email });

    if (!oldUser)
      return res.status(400).json({ success: false, message: "Bad request" });
    const verifiedPassword = await verify(oldUser.password || "", password);
    if (!verifiedPassword)
      return res.status(400).json({ success: false, message: "Bad request" });

    const token = await jwt.sign(
      { id: oldUser._id },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "31d",
      }
    );

    return res
      .status(200)
      .json({ success: true, token, message: "login is successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (email) {
      const existing = await UserModel.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "Bu email allaqachon ro'yxatdan o'tgan" });
      }
    }

    const user = await UserModel.create({
      role: "user",
      username,
      email,
      password,
    });
    const token = await jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "",
      { expiresIn: "31d" }
    );
    return res.status(201).json({ success: true, message: "user created", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const TelegramLogin = async (req, res) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ success: false, message: "Telegram bot token sozlanmagan" });
    }

    const { initData } = req.body;
    const result = verifyTelegramInitData(initData, botToken);
    if (!result.valid || !result.user) {
      return res.status(401).json({ success: false, message: "Telegram ma'lumotlari tasdiqlanmadi" });
    }

    const telegramId = String(result.user.id);
    let user = await UserModel.findOne({ telegramId });

    if (!user) {
      const username = result.user.username || result.user.first_name || `tg${telegramId}`;
      user = await UserModel.create({
        role: "user",
        telegramId,
        firstName: result.user.first_name,
        username,
        email: `tg${telegramId}@telegram.local`,
      });
    } else if (result.user.first_name && user.firstName !== result.user.first_name) {
      user.firstName = result.user.first_name;
      await user.save();
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", { expiresIn: "31d" });
    return res.status(200).json({
      success: true,
      token,
      user: { username: user.username, firstName: user.firstName },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { Login, SignUp, TelegramLogin };
