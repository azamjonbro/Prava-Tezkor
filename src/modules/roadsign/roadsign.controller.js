import RoadSignModel from "./roadsign.model.js";

const getRoadSigns = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const signs = await RoadSignModel.find(filter).sort({ order: 1 });

    return res.status(200).json({ success: true, signs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoadSignById = async (req, res) => {
  try {
    const sign = await RoadSignModel.findById(req.params.id);
    if (!sign) {
      return res.status(404).json({ success: false, message: "not found" });
    }
    return res.status(200).json({ success: true, sign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getRoadSigns, getRoadSignById };
