import { model, Schema } from "mongoose";

const RoadSignSchema = new Schema(
  {
    number: { type: String, required: true },
    category: { type: String, required: true, index: true },
    name: {
      lotin: { type: String, required: true },
      krill: { type: String },
      rus: { type: String },
    },
    description: {
      lotin: { type: String },
      krill: { type: String },
      rus: { type: String },
    },
    shape: { type: String, required: true },
    svgKey: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RoadSignModel = model("RoadSign", RoadSignSchema);
export default RoadSignModel;
