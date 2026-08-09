import UserModel from "./user.model.js";
import { hash } from "argon2";
import EarnMoneyModel from "../earn_money/model.js";

const findByLogin = async (data) => {
  try {
    return await UserModel.findOne(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createUser = async (data) => {
  try {
    const oldUser = await findByLogin({ email: data.email });
    if (!oldUser) {
      const user = await UserModel.create(data);

      return { success: true, message: "user created" };
    } else {
      return { success: false, message: "There is already email" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req?.user?.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "user found", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await hash(update.password);
    } else {
      delete update.password;
    }

    const user = await UserModel.findByIdAndUpdate(req?.user?.id, update, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "user updated", user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

const inviteUser = async (req, res) => {
  try {
    const invited_user = await UserModel.findOne({
      invite_code: req.body.invite_code,
    });
    const user = await UserModel.findById(req?.user?.id || "");

    if (!invited_user) {
      return res.status(404).json({ message: "Invite code not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "Invite code not found" });
    }

    if (invited_user._id.toString() === req.user?.id) {
      return res.status(400).json({ message: "You can't invite yourself" });
    }

    if (user.invitedUsers.includes(req.body.invite_code)) {
      return res.status(400).json({ message: "User already invited" });
    }

    user.invitedUsers.push(req.body.invite_code);
    user.coin += 200;

    await user.save();

    return res.json({
      message: "Invite successful, coins added",
      inviterCoins: user.coin,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};
const CreateFee = async (req, res) => {
  try {
    const money = await EarnMoneyModel.findById(req.body.money_id);
    const user = await UserModel.findById(req?.user?.id);

    if (!money) {
      return res.status(404).json({ message: "Money not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.coin < money.coin) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    user.coin -= money.coin;

    user.fees.push({
      isPaid: false,
      credit_card: req.body.credit_card,
      money_id: req.body.money_id,
      name: req.body.name,
    });

    await user.save();

    return res.status(201).json({ message: "Fee created" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

const UpdatePaid = async (req, res) => {
  try {
    const user = await UserModel.findById(req?.params?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fee = user.fees.find(
      (i) => i.money_id?.toString() === req.params.moneyId
    );
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    fee.isPaid = !fee.isPaid;
    await fee.save();

    return res.status(200).json({ message: "is paid updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};

export {
  findByLogin,
  createUser,
  getProfile,
  updateUser,
  inviteUser,
  CreateFee,
  UpdatePaid,
};
