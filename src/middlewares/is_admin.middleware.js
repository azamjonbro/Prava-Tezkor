import UserModel from "../modules/user/user.model.js";

const IsAdminMiddlware = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.user?.id);

    if (!user || user?.role != "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export default IsAdminMiddlware;
