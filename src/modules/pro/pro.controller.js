import ProRequestModel from "./pro.model.js";
import UserModel from "../user/user.model.js";

export const PRO_PRICE = 10000;
const PRO_DURATION_DAYS = 30;

function isProActive(user) {
  return Boolean(user.proExpiresAt && user.proExpiresAt.getTime() > Date.now());
}

const getStatus = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const pendingRequest = await ProRequestModel.findOne({ user: user._id, status: "pending" });

    return res.status(200).json({
      success: true,
      isPro: isProActive(user),
      proExpiresAt: user.proExpiresAt,
      price: PRO_PRICE,
      pendingRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRequest = async (req, res) => {
  try {
    const { cardNumber } = req.body;
    if (!cardNumber || String(cardNumber).replace(/\D/g, "").length < 12) {
      return res.status(400).json({ success: false, message: "Karta raqami noto'g'ri" });
    }

    const existing = await ProRequestModel.findOne({ user: req.user.id, status: "pending" });
    if (existing) {
      return res.status(200).json({ success: true, request: existing, message: "So'rov allaqachon yuborilgan" });
    }

    const request = await ProRequestModel.create({
      user: req.user.id,
      amount: PRO_PRICE,
      cardNumber,
    });

    return res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminListRequests = async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const requests = await ProRequestModel.find(filter).sort({ createdAt: -1 });

    const userIds = requests.map((r) => r.user);
    const users = await UserModel.find({ _id: { $in: userIds } }).select("username email");
    const usersById = new Map(users.map((u) => [String(u._id), u]));

    const withUser = requests.map((r) => ({
      _id: r._id,
      amount: r.amount,
      cardNumber: r.cardNumber,
      status: r.status,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      username: usersById.get(String(r.user))?.username || "Foydalanuvchi",
      email: usersById.get(String(r.user))?.email,
    }));

    return res.status(200).json({ success: true, requests: withUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminApprove = async (req, res) => {
  try {
    const request = await ProRequestModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "So'rov topilmadi" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "So'rov allaqachon ko'rib chiqilgan" });
    }

    const user = await UserModel.findById(request.user);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    const base = isProActive(user) && user.proExpiresAt ? user.proExpiresAt.getTime() : Date.now();
    user.proExpiresAt = new Date(base + PRO_DURATION_DAYS * 24 * 60 * 60 * 1000);
    await user.save();

    request.status = "approved";
    request.reviewedAt = new Date();
    await request.save();

    return res.status(200).json({ success: true, request, proExpiresAt: user.proExpiresAt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminReject = async (req, res) => {
  try {
    const request = await ProRequestModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "So'rov topilmadi" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "So'rov allaqachon ko'rib chiqilgan" });
    }

    request.status = "rejected";
    request.reviewedAt = new Date();
    await request.save();

    return res.status(200).json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getStatus, createRequest, adminListRequests, adminApprove, adminReject };
