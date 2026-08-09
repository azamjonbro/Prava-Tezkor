import { model, Schema } from "mongoose";

const EarnMoneySchema = new Schema(
  {
    coin: { type: Number, required: true },
    price: { type: String, required: true },
  },
  { timestamps: true }
);

const EarnMoneyModel = model("earn_money", EarnMoneySchema);
export default EarnMoneyModel;
