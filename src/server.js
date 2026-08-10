import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectionToDB } from "./configs/db.js";
import { createUser, findByLogin } from "./modules/user/user.controller.js";
import AuthRouter from "./modules/auth/auth.route.js";
import UserRouter from "./modules/user/user.route.js";
import TicketRouter from "./modules/ticket/ticket.route.js";
import EarnMoneyRouter from "./modules/earn_money/route.js";
import CategoryRouter from "./modules/category/category.route.js";
import RoadSignRouter from "./modules/roadsign/roadsign.route.js";
import ProgressRouter from "./modules/progress/progress.route.js";
import SavedRouter from "./modules/saved/saved.route.js";
import DuelRouter from "./modules/duel/duel.route.js";
import LeaderboardRouter from "./modules/leaderboard/leaderboard.route.js";
import ProRouter from "./modules/pro/pro.route.js";
import CommentRouter from "./modules/comment/comment.route.js";
import TtsRouter from "./modules/tts/tts.route.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

// Server sits behind nginx — trust its X-Forwarded-For so the rate
// limiter (and req.ip generally) sees the real client IP, not nginx's.
app.set("trust proxy", 1);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/images", express.static(path.join(__dirname, "./uploads")));

app.use("/api", apiLimiter);

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/ticket", TicketRouter);
app.use("/api/earn_money", EarnMoneyRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/roadsign", RoadSignRouter);
app.use("/api/progress", ProgressRouter);
app.use("/api/saved", SavedRouter);
app.use("/api/duel", DuelRouter);
app.use("/api/leaderboard", LeaderboardRouter);
app.use("/api/pro", ProRouter);
app.use("/api/comment", CommentRouter);
app.use("/api/tts", TtsRouter);

(async function Start() {
  try {
    await ConnectionToDB();

    const admin = await findByLogin({ email: "admin@gmail.com" });

    if (!admin) {
      await createUser({
        username: "admin",
        email: "admin@gmail.com",
        password: "admin",
        role: "admin",
      });
      console.log("admin created");
    } else {
      console.log("there is already admin");
    }
    const PORT = Number(process.env.PORT) || 9000;
    app.listen(PORT, () => {
      console.log("server is running", PORT);
    });
  } catch (error) {
    console.error(error);
  }
})();
