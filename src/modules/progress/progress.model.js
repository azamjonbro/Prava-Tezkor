import { model, Schema } from "mongoose";

const UserProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questionId: { type: Number, required: true },
    topic: { type: String },
    isCorrect: { type: Boolean, required: true },
  },
  { timestamps: true }
);

UserProgressSchema.index({ user: 1, questionId: 1 }, { unique: true });

const UserProgressModel = model("UserProgress", UserProgressSchema);
export default UserProgressModel;
