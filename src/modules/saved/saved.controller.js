import SavedQuestionModel from "./saved.model.js";
import TicketModel from "../ticket/ticket.model.js";

const toggleSaved = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    if (!Number.isFinite(questionId)) {
      return res.status(400).json({ success: false, message: "questionId is required" });
    }

    const existing = await SavedQuestionModel.findOneAndDelete({ user: req.user.id, questionId });
    if (existing) {
      return res.status(200).json({ success: true, saved: false });
    }

    await SavedQuestionModel.create({ user: req.user.id, questionId });
    return res.status(200).json({ success: true, saved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSavedQuestions = async (req, res) => {
  try {
    const entries = await SavedQuestionModel.find({ user: req.user.id });
    const questionIds = entries.map((e) => e.questionId);
    const questions = await TicketModel.find({ id: { $in: questionIds } });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { toggleSaved, getSavedQuestions };
