import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { ConnectionToDB } from "../configs/db.js";
import CategoryModel from "../modules/category/category.model.js";
import TicketModel from "../modules/ticket/ticket.model.js";
import RoadSignModel from "../modules/roadsign/roadsign.model.js";
import { TOPICS, classifyTopic } from "./topics.js";
import { ROAD_SIGNS, SIGN_CATEGORIES } from "./roadsigns.js";
import { latinToCyrillicUz } from "../utils/translit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

// A handful of source entries store options "transposed" — one array per
// language instead of one object per answer. Normalize to Localized[].
function normalizeAnswers(answers, options) {
  if (answers) return answers;
  if (!options) return undefined;
  if (Array.isArray(options)) return options;

  const count = options.lotin?.length || 0;
  return Array.from({ length: count }, (_, i) => ({
    lotin: options.lotin[i] || "",
    krill: options.krill[i] || "",
    rus: options.rus[i] || "",
  }));
}

const UPLOADS_DIR = path.join(__dirname, "../uploads");
const DEFAULT_IMAGE = "/images/default.jpg";

function normalizeImagePath(raw) {
  let cleaned = raw.trim().replace(/^\.\//, "/");
  // fixes a handful of source-data typos like "questio311.webp" (missing the 'n')
  cleaned = cleaned.replace(/\/images\/questio(\d)/, "/images/question$1");

  const filename = cleaned.split("/").pop() || "";
  if (!filename || !fs.existsSync(path.join(UPLOADS_DIR, filename))) {
    return DEFAULT_IMAGE;
  }
  return cleaned;
}

async function seedTopicCategories() {
  let created = 0;
  for (const topic of TOPICS) {
    const result = await CategoryModel.findOneAndUpdate(
      { key: topic.key },
      { ...topic, type: "topic" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result) created += 1;
  }
  console.log(`Categories (topic): ${created} upserted`);
}

async function seedSignCategories() {
  let created = 0;
  for (const category of SIGN_CATEGORIES) {
    await CategoryModel.findOneAndUpdate(
      { key: category.key },
      { ...category, type: "signs" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    created += 1;
  }
  console.log(`Categories (signs): ${created} upserted`);
}

async function seedTickets() {
  const file = path.join(__dirname, "../../questions.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));

  let upserted = 0;
  let skipped = 0;
  let fallbackImages = 0;

  for (const q of raw) {
    const questions = q.questions || q.question;
    const answers = normalizeAnswers(q.answers, q.options);

    if (!questions?.lotin || !answers || answers.length < 2) {
      console.warn(`Skipping question id=${q.id}: missing questions/answers after normalization`);
      skipped += 1;
      continue;
    }

    const imgUrl = normalizeImagePath(q.imgUrl);
    if (imgUrl === DEFAULT_IMAGE) fallbackImages += 1;

    const topic = classifyTopic(questions.lotin);
    await TicketModel.findOneAndUpdate(
      { id: q.id },
      { id: q.id, imgUrl, questions, answers, izoh: q.izoh, correct_answer: q.correct_answer, topic },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted += 1;
  }
  console.log(`Tickets: ${upserted} upserted, ${skipped} skipped, ${fallbackImages} using default image`);
}

async function seedRoadSigns() {
  let order = 0;
  let upserted = 0;
  for (const sign of ROAD_SIGNS) {
    order += 1;
    await RoadSignModel.findOneAndUpdate(
      { number: sign.number },
      {
        number: sign.number,
        category: sign.category,
        shape: sign.shape,
        svgKey: sign.svgKey || null,
        order,
        name: {
          lotin: sign.nameLotin,
          krill: latinToCyrillicUz(sign.nameLotin),
          rus: sign.nameRus,
        },
        description: {
          lotin: sign.descLotin,
          krill: latinToCyrillicUz(sign.descLotin),
          rus: sign.descRus,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted += 1;
  }
  console.log(`Road signs: ${upserted} upserted`);
}

async function run() {
  await ConnectionToDB();
  await seedTopicCategories();
  await seedSignCategories();
  await seedTickets();
  await seedRoadSigns();

  const [ticketCount, signCount, categoryCount] = await Promise.all([
    TicketModel.countDocuments(),
    RoadSignModel.countDocuments(),
    CategoryModel.countDocuments(),
  ]);
  console.log("--- Seed summary ---");
  console.log({ tickets: ticketCount, roadSigns: signCount, categories: categoryCount });

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
