import { hash } from "argon2";
import { model, Schema } from "mongoose";
import { generateInviteCode } from "../../utils/generateCode.js";

const UserSchema = new Schema(
  {
    username: { type: String },
    role: { type: String, enum: ["admin", "user"] },
    password: { type: String },
    email: { type: String, unique: true },
    invite_code: { type: String, unique: true },
    coin: { type: Number, default: 0 },
    isBot: { type: Boolean, default: false },
    telegramId: { type: String, unique: true, sparse: true },
    firstName: { type: String },
    phone: { type: String, default: null },
    proExpiresAt: { type: Date, default: null },
    invitedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fees: {
      type: [
        {
          isPaid: { type: Boolean, default: false },
          credit_card: { type: String },
          money_id: { type: Schema.Types.ObjectId, ref: "Money" },
          name: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.email) {
    user.email = `user${Date.now()}@gmail.com`;
  }

  if (!user.username) {
    user.username = user.email.split("@")[0];
  }

  if (!user.password) {
    user.password = `${user.username}${Date.now()}`;
  }

  if (user.isModified("password")) {
    user.password = await hash(user.password);
  }

  user.invite_code = generateInviteCode();

  next();
});

const UserModel = model("User", UserSchema);
export default UserModel;
