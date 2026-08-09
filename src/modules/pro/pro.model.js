import { model, Schema } from "mongoose";

const ProRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    cardNumber: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const ProRequestModel = model("ProRequest", ProRequestSchema);
export default ProRequestModel;
