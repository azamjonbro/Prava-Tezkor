import { model, Schema } from "mongoose";

const ParticipantSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isBot: { type: Boolean, default: false },
    score: { type: Number, default: null },
    finishedAt: { type: Date, default: null },
    joinedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const DuelSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    capacity: { type: Number, enum: [2, 3, 4], default: 2 },
    mode: { type: String, enum: ["open", "bot"], default: "open" },
    status: { type: String, enum: ["waiting", "active", "finished"], default: "waiting" },
    questionIds: [{ type: Number, required: true }],
    participants: { type: [ParticipantSchema], default: [] },
    winnerUserIds: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

const DuelModel = model("Duel", DuelSchema);
export default DuelModel;
