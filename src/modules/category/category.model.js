import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    type: { type: String, enum: ["topic", "signs"], required: true },
    name: {
      lotin: { type: String, required: true },
      krill: { type: String, required: true },
      rus: { type: String, required: true },
    },
    icon: { type: String, default: "book" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategoryModel = model("Category", CategorySchema);
export default CategoryModel;
