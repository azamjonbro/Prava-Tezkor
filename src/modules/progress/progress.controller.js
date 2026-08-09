import UserProgressModel from "./progress.model.js";
import TicketModel from "../ticket/ticket.model.js";

const recordAnswer = async (req, res) => {
  try {
    const { questionId, topic, isCorrect } = req.body;
    if (typeof questionId !== "number" || typeof isCorrect !== "boolean") {
      return res.status(400).json({ success: false, message: "questionId and isCorrect are required" });
    }

    const progress = await UserProgressModel.findOneAndUpdate(
      { user: req.user.id, questionId },
      { user: req.user.id, questionId, topic, isCorrect },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const entries = await UserProgressModel.find({ user: req.user.id });
    const correct = entries.filter((e) => e.isCorrect).length;
    const wrong = entries.length - correct;

    return res.status(200).json({
      success: true,
      stats: { correct, wrong, total: entries.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMistakes = async (req, res) => {
  try {
    const entries = await UserProgressModel.find({ user: req.user.id, isCorrect: false });
    const questionIds = entries.map((e) => e.questionId);
    const questions = await TicketModel.find({ id: { $in: questionIds } });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { recordAnswer, getStats, getMistakes };
