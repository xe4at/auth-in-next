import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immmutable: true,
  },
});

const User = models.User || model("User", userSchema);

export default User;
