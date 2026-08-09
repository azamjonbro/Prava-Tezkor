import DuelModel from "./duel.model.js";
import TicketModel from "../ticket/ticket.model.js";
import UserModel from "../user/user.model.js";
import { generateDuelCode } from "../../utils/generateDuelCode.js";

const QUESTIONS_PER_DUEL = 10;
const VALID_CAPACITIES = [2, 3, 4];

const BOT_NAMES = ["Aziz_Bot", "Malika_Bot", "Sardor_Bot", "Nodira_Bot", "Jasur_Bot", "Diyora_Bot"];

async function getBotUser(excludeIds) {
  const available = BOT_NAMES.filter((name) => !excludeIds.includes(name));
  const pool = available.length ? available : BOT_NAMES;
  const name = pool[Math.floor(Math.random() * pool.length)];
  const email = `${name.toLowerCase()}@prava.bot`;
  let bot = await UserModel.findOne({ email });
  if (!bot) {
    bot = await UserModel.create({ username: name, email, role: "user", isBot: true });
  }
  return bot;
}

function randomBotScore(questionCount) {
  const accuracy = 0.4 + Math.random() * 0.5;
  return Math.min(questionCount, Math.max(0, Math.round(questionCount * accuracy)));
}

async function buildDuelPayload(duel, requesterId) {
  const userIds = duel.participants.map((p) => String(p.user));
  const users = await UserModel.find({ _id: { $in: userIds } }).select("username isBot");
  const usersById = new Map(users.map((u) => [String(u._id), u]));

  const participants = duel.participants.map((p) => ({
    userId: String(p.user),
    username: usersById.get(String(p.user))?.username || "Foydalanuvchi",
    isBot: p.isBot,
    score: p.score,
    finishedAt: p.finishedAt,
  }));

  const isParticipant = duel.participants.some((p) => String(p.user) === requesterId);
  const me = participants.find((p) => p.userId === requesterId) || null;
  const creatorUser = usersById.get(String(duel.creator));

  let questions = [];
  if (duel.status !== "waiting") {
    const tickets = await TicketModel.find({ id: { $in: duel.questionIds } });
    questions = duel.questionIds.map((id) => tickets.find((t) => t.id === id)).filter(Boolean);
  }

  return {
    success: true,
    duel: {
      code: duel.code,
      capacity: duel.capacity,
      mode: duel.mode,
      status: duel.status,
      creator: String(duel.creator),
      winnerUserIds: duel.winnerUserIds.map(String),
    },
    creatorUsername: creatorUser?.username || "Foydalanuvchi",
    participants,
    isParticipant,
    isCreator: String(duel.creator) === requesterId,
    me,
    questions,
  };
}

const createDuel = async (req, res) => {
  try {
    const capacity = VALID_CAPACITIES.includes(req.body.capacity) ? req.body.capacity : 2;
    const mode = req.body.mode === "bot" ? "bot" : "open";

    const pool = await TicketModel.aggregate([{ $sample: { size: QUESTIONS_PER_DUEL } }]);
    const questionIds = pool.map((q) => q.id).filter((id) => typeof id === "number");
    if (!questionIds.length) {
      return res.status(400).json({ success: false, message: "No questions available yet" });
    }

    let code = generateDuelCode();
    while (await DuelModel.findOne({ code })) {
      code = generateDuelCode();
    }

    const participants = [{ user: req.user.id, isBot: false, score: null, finishedAt: null, joinedAt: new Date() }];

    let status = "waiting";
    if (mode === "bot") {
      const usedNames = [];
      for (let i = participants.length; i < capacity; i++) {
        const bot = await getBotUser(usedNames);
        usedNames.push(bot.username || "");
        participants.push({
          user: bot._id,
          isBot: true,
          score: randomBotScore(questionIds.length),
          finishedAt: new Date(),
          joinedAt: new Date(),
        });
      }
      status = "active";
    }

    const duel = await DuelModel.create({ code, creator: req.user.id, capacity, mode, status, questionIds, participants });
    const payload = await buildDuelPayload(duel, req.user.id);
    return res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOpenDuels = async (req, res) => {
  try {
    const duels = await DuelModel.find({ status: "waiting", mode: "open" }).sort({ createdAt: -1 }).limit(20);
    const creatorIds = duels.map((d) => String(d.creator));
    const creators = await UserModel.find({ _id: { $in: creatorIds } }).select("username");
    const creatorsById = new Map(creators.map((u) => [String(u._id), u.username]));

    const open = duels.map((d) => ({
      code: d.code,
      capacity: d.capacity,
      filled: d.participants.length,
      creatorUsername: creatorsById.get(String(d.creator)) || "Foydalanuvchi",
      isMine: d.participants.some((p) => String(p.user) === req.user.id),
      createdAt: d.createdAt,
    }));

    return res.status(200).json({ success: true, duels: open });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const joinDuel = async (req, res) => {
  try {
    const duel = await DuelModel.findOne({ code: req.params.code });
    if (!duel) {
      return res.status(404).json({ success: false, message: "Duel not found" });
    }

    const alreadyIn = duel.participants.some((p) => String(p.user) === req.user.id);
    if (!alreadyIn) {
      if (duel.status !== "waiting") {
        return res.status(400).json({ success: false, message: "Duel to'la yoki allaqachon boshlangan" });
      }
      if (duel.participants.length >= duel.capacity) {
        return res.status(400).json({ success: false, message: "Xona to'lgan" });
      }
      duel.participants.push({ user: req.user.id, isBot: false, score: null, finishedAt: null, joinedAt: new Date() });
      if (duel.participants.length >= duel.capacity) {
        duel.status = "active";
      }
      await duel.save();
    }

    const payload = await buildDuelPayload(duel, req.user.id);
    return res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const fillWithBots = async (req, res) => {
  try {
    const duel = await DuelModel.findOne({ code: req.params.code });
    if (!duel) {
      return res.status(404).json({ success: false, message: "Duel not found" });
    }
    const isParticipant = duel.participants.some((p) => String(p.user) === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Not a participant" });
    }

    if (duel.status === "waiting") {
      const usedNames = [];
      while (duel.participants.length < duel.capacity) {
        const bot = await getBotUser(usedNames);
        usedNames.push(bot.username || "");
        duel.participants.push({
          user: bot._id,
          isBot: true,
          score: randomBotScore(duel.questionIds.length),
          finishedAt: new Date(),
          joinedAt: new Date(),
        });
      }
      duel.status = "active";
      await duel.save();
    }

    const payload = await buildDuelPayload(duel, req.user.id);
    return res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDuel = async (req, res) => {
  try {
    const duel = await DuelModel.findOne({ code: req.params.code });
    if (!duel) {
      return res.status(404).json({ success: false, message: "Duel not found" });
    }
    const payload = await buildDuelPayload(duel, req.user.id);
    return res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const finishDuel = async (req, res) => {
  try {
    const { score } = req.body;
    if (typeof score !== "number") {
      return res.status(400).json({ success: false, message: "score is required" });
    }

    const duel = await DuelModel.findOne({ code: req.params.code });
    if (!duel) {
      return res.status(404).json({ success: false, message: "Duel not found" });
    }

    const participant = duel.participants.find((p) => String(p.user) === req.user.id);
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not a participant" });
    }

    if (!participant.finishedAt) {
      participant.score = score;
      participant.finishedAt = new Date();
      duel.markModified("participants");

      const allFinished = duel.participants.every((p) => p.finishedAt);
      if (allFinished) {
        duel.status = "finished";
        const maxScore = Math.max(...duel.participants.map((p) => p.score ?? 0));
        duel.winnerUserIds = duel.participants
          .filter((p) => (p.score ?? 0) === maxScore)
          .map((p) => p.user);
      }
      await duel.save();
    }

    const payload = await buildDuelPayload(duel, req.user.id);
    return res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createDuel, getOpenDuels, joinDuel, fillWithBots, getDuel, finishDuel };
