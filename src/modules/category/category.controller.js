import CategoryModel from "./category.model.js";
import TicketModel from "../ticket/ticket.model.js";
import RoadSignModel from "../roadsign/roadsign.model.js";

const getCategories = async (req, res) => {
  try {
    const type = req.query.type;
    const filter = type ? { type } : {};
    const categories = await CategoryModel.find(filter).sort({ order: 1 });

    const withCounts = await Promise.all(
      categories.map(async (category) => {
        const count =
          category.type === "topic"
            ? await TicketModel.countDocuments({ topic: category.key })
            : await RoadSignModel.countDocuments({ category: category.key });
        return { ...category.toObject(), count };
      })
    );

    return res.status(200).json({ success: true, categories: withCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getCategories };
