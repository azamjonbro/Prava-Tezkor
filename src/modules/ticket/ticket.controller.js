import TicketModel from "./ticket.model.js";

const GROUP_SIZE = 20;

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
    const tickets = await TicketModel.find(filter).sort({ id: 1 });

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

    const tickets = await TicketModel.find({})
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
    const tickets = await TicketModel.aggregate([{ $sample: { size: count } }]);

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

const searchTickets = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json({ success: true, tickets: [] });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const tickets = await TicketModel.find({
      $or: [
        { "questions.lotin": regex },
        { "questions.krill": regex },
        { "questions.rus": regex },
      ],
    }).limit(30);

    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({
      id: req.params.id,
    });

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
};
