import TicketModel from "./ticket.model.js";
import UserModel from "../user/user.model.js";

const GROUP_SIZE = 20;

// Public list/browse endpoints must not leak the answer key — only the
// admin panel (which reuses these same endpoints to render its edit
// forms) is allowed to see correct_answer up front.
async function isAdminRequester(req) {
  if (!req.user?.id) return false;
  const user = await UserModel.findById(req.user.id).select("role");
  return user?.role === "admin";
}

const CreateTikcet = async (req, res) => {
  try {
    const answers = req.body["answers"].map((i) => i);
    const imgUrl = req.file
      ? `/images/${req.file.filename}`
      : "/images/default.png"; // agar rasm kelmasa default
    const body = {
      imgUrl: imgUrl,
      questions: {
        lotin: req.body["questions"]["lotin"],
        rus: req.body["questions"]["rus"],
        krill: req.body["questions"]["krill"],
      },
      answers,
      currentAnswer: Number(req.body.currentAnswer),
      izoh: {
        lotin: req.body["izoh"]["lotin"],
        rus: req.body["izoh"]["rus"],
        krill: req.body["izoh"]["krill"],
      },
    };

    const ticket = await TicketModel.create(body);

    return res
      .status(200)
      .json({ success: true, message: "Ticket created", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const topic = req.query.topic;
    const filter = topic ? { topic } : {};
    const hideAnswer = !(await isAdminRequester(req));
    const tickets = await TicketModel.find(filter)
      .select(hideAnswer ? "-correct_answer" : "")
      .sort({ id: 1 });

    return res
      .status(200)
      .json({ success: true, message: "list of tickets", tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lightweight summary for the "Biletlar" grid — no question content, just
// how many fixed-size groups exist, so the page doesn't have to download
// the entire question bank just to render a grid of ticket numbers.
const getTicketSummary = async (req, res) => {
  try {
    const total = await TicketModel.countDocuments();
    const groupCount = Math.ceil(total / GROUP_SIZE);
    const groups = Array.from({ length: groupCount }, (_, i) => {
      const remaining = total - i * GROUP_SIZE;
      return { id: i + 1, count: Math.min(GROUP_SIZE, remaining) };
    });

    return res.status(200).json({ success: true, total, groupSize: GROUP_SIZE, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTicketGroup = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    if (!groupId || groupId < 1) {
      return res.status(400).json({ success: false, message: "Invalid group id" });
    }

    const hideAnswer = !(await isAdminRequester(req));
    const tickets = await TicketModel.find({})
      .select(hideAnswer ? "-correct_answer" : "")
      .sort({ id: 1 })
      .skip((groupId - 1) * GROUP_SIZE)
      .limit(GROUP_SIZE);

    if (!tickets.length) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    return res.status(200).json({ success: true, id: groupId, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRandomTickets = async (req, res) => {
  try {
    const count = Math.min(100, Math.max(1, Number(req.query.count) || 20));
    const hideAnswer = !(await isAdminRequester(req));
    const pipeline = [{ $sample: { size: count } }];
    if (hideAnswer) pipeline.push({ $unset: "correct_answer" });
    const tickets = await TicketModel.aggregate(pipeline);

    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reportTicket = async (req, res) => {
  try {
    const ticket = await TicketModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $inc: { reportCount: 1 } },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Savol topilmadi" });
    }
    return res.status(200).json({ success: true, message: "Xabar yuborildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getReportedTickets = async (req, res) => {
  try {
    const tickets = await TicketModel.find({ reportCount: { $gt: 0 } }).sort({ reportCount: -1 });
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const dismissReport = async (req, res) => {
  try {
    const ticket = await TicketModel.findOneAndUpdate(
      { id: Number(req.params.id) },
      { reportCount: 0 },
      { new: true }
    );
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Savol topilmadi" });
    }
    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchTickets = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json({ success: true, tickets: [] });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const hideAnswer = !(await isAdminRequester(req));
    const tickets = await TicketModel.find({
      $or: [
        { "questions.lotin": regex },
        { "questions.krill": regex },
        { "questions.rus": regex },
      ],
    })
      .select(hideAnswer ? "-correct_answer" : "")
      .limit(30);

    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const hideAnswer = !(await isAdminRequester(req));
    const ticket = await TicketModel.findOne({
      id: req.params.id,
    }).select(hideAnswer ? "-correct_answer" : "");

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "ticket not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "ticket found", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Server-side answer verification — the client never receives
// correct_answer up front for the endpoints above, so it asks here once
// the user has actually picked an option.
const checkAnswer = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ id: Number(req.params.id) }).select("correct_answer");
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Savol topilmadi" });
    }

    const selectedIndex = Number(req.body.selectedIndex);
    const correct = ticket.correct_answer === selectedIndex;

    return res.status(200).json({ success: true, correct, correct_answer: ticket.correct_answer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTicketById = async (req, res) => {
  try {
    const existingTicket = await TicketModel.findById(req.params.id);
    if (!existingTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const answers = req.body["answers"].map((i) => i);

    const questions = {
      lotin: req.body["questions[lotin]"],
      rus: req.body["questions[rus]"],
      krill: req.body["questions[krill]"],
    };

    const imgUrl = req.file
      ? `/uploads/${req.file.filename}`
      : existingTicket.imgUrl;

    const izoh = {
      lotin: req.body["izoh[lotin]"],
      rus: req.body["izoh[rus]"],
      krill: req.body["izoh[krill]"],
    };

    const body = {
      imgUrl,
      questions,
      answers,
      currentAnswer: Number(req.body.currentAnswer),
      izoh: !izoh ? existingTicket.izoh : izoh,
    };

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Ticket updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTicketById = async (req, res) => {
  try {
    const ticket = await TicketModel.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "ticket not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "ticket deleted", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  CreateTikcet,
  getTickets,
  getTicketById,
  updateTicketById,
  deleteTicketById,
  getTicketSummary,
  getTicketGroup,
  getRandomTickets,
  searchTickets,
  reportTicket,
  checkAnswer,
  getReportedTickets,
  dismissReport,
};
