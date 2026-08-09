import UserModel from "../modules/user/user.model.js";

const requireProMiddleware = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user?.id);
    const isPro = Boolean(user?.proExpiresAt && user.proExpiresAt.getTime() > Date.now());

    if (!isPro) {
      return res.status(403).json({ success: false, message: "Bu funksiya faqat PRO foydalanuvchilar uchun", requiresPro: true });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server xatosi" });
  }
};

export default requireProMiddleware;
