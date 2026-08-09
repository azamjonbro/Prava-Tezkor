import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TicketModel from "../ticket/ticket.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TTS_DIR = path.join(__dirname, "../../uploads/tts");
const ALLOWED_LANGS = ["lotin", "krill", "rus"];
const ALLOWED_TYPES = ["question", "izoh"];

if (!fs.existsSync(TTS_DIR)) {
  fs.mkdirSync(TTS_DIR, { recursive: true });
}

const getSpeech = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const lang = ALLOWED_LANGS.includes(req.query.lang) ? req.query.lang : "lotin";
    const type = ALLOWED_TYPES.includes(req.query.type) ? req.query.type : "question";

    const cacheKey = `${questionId}-${type}-${lang}.mp3`;
    const cachePath = path.join(TTS_DIR, cacheKey);

    if (fs.existsSync(cachePath)) {
      return res.status(200).sendFile(cachePath);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "OpenAI kaliti sozlanmagan" });
    }

    const ticket = await TicketModel.findOne({ id: questionId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Savol topilmadi" });
    }

    const source = type === "izoh" ? ticket.izoh : ticket.questions;
    const text = source?.[lang];
    if (!text) {
      return res.status(404).json({ success: false, message: "Matn topilmadi" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        response_format: "mp3",
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI TTS error:", errText);
      return res.status(502).json({ success: false, message: "Ovoz yaratishda xatolik" });
    }

    const buffer = Buffer.from(await openaiRes.arrayBuffer());
    fs.writeFileSync(cachePath, buffer);

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getSpeech };
