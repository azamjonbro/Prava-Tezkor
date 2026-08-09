import { model, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    questionId: { type: Number, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const CommentModel = model("Comment", CommentSchema);
export default CommentModel;
