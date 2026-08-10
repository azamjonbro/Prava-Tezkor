import { model, Schema } from "mongoose";

const SavedQuestionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questionId: { type: Number, required: true },
  },
  { timestamps: true }
);

SavedQuestionSchema.index({ user: 1, questionId: 1 }, { unique: true });

const SavedQuestionModel = model("SavedQuestion", SavedQuestionSchema);
export default SavedQuestionModel;
