import { connect } from "mongoose";

export const ConnectionToDB = async () => {
  try {
    console.log("loading...");
    await connect(process.env.MONGO_URL || "");
    console.log("mongodb is connected");
  } catch (error) {
    console.error("connection error:", error);
  }
};
