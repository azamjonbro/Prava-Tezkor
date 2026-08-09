import UserProgressModel from "../progress/progress.model.js";
import UserModel from "../user/user.model.js";

const getTop = async (req, res) => {
  try {
    const rows = await UserProgressModel.aggregate([
      {
        $group: {
          _id: "$user",
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { correct: -1, total: 1 } },
      { $limit: 50 },
    ]);

    const userIds = rows.map((r) => r._id);
    const users = await UserModel.find({ _id: { $in: userIds } }).select("username");
    const usersById = new Map(users.map((u) => [String(u._id), u.username]));

    const leaderboard = rows.map((r, index) => ({
      rank: index + 1,
      userId: r._id,
      username: usersById.get(String(r._id)) || "Foydalanuvchi",
      correct: r.correct,
      total: r.total,
      accuracy: r.total ? Math.round((r.correct / r.total) * 100) : 0,
      isMe: String(r._id) === req.user.id,
    }));

    return res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getTop };
