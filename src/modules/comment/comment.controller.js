import CommentModel from "./comment.model.js";
import UserModel from "../user/user.model.js";

const listComments = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const comments = await CommentModel.find({ questionId }).sort({ createdAt: -1 }).limit(100);

    const userIds = comments.map((c) => c.user);
    const users = await UserModel.find({ _id: { $in: userIds } }).select("username");
    const usersById = new Map(users.map((u) => [String(u._id), u.username]));

    const withUser = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      createdAt: c.createdAt,
      username: usersById.get(String(c.user)) || "Foydalanuvchi",
      isMine: String(c.user) === req.user.id,
    }));

    return res.status(200).json({ success: true, comments: withUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const text = String(req.body.text || "").trim();
    if (!text) {
      return res.status(400).json({ success: false, message: "Matn bo'sh bo'lmasligi kerak" });
    }
    if (text.length > 500) {
      return res.status(400).json({ success: false, message: "Matn juda uzun" });
    }

    const comment = await CommentModel.create({ questionId, user: req.user.id, text });
    const user = await UserModel.findById(req.user.id).select("username");

    return res.status(201).json({
      success: true,
      comment: {
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        username: user?.username || "Foydalanuvchi",
        isMine: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listComments, createComment };
