import User from "../../../models/User";
import { verifyPassword, verifyToken } from "../../../utils/auth";
import connectDB from "../../../utils/connectDb";

async function handler(req, res) {
  if (req.method !== "POST") return;

  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return res
      .stasus(500)
      .json({ status: "failed", message: "Error in connection to DB" });
  }

  const { name, lastName, password } = req.body;
  const { token } = req.cookies;
  const secretkey = process.env.SECRET_KEY;

  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized, please login" });
  }

  const result = verifyToken(token, secretkey);

  if (!result) {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized, please login" });
  }

  const user = await User.findOne({ email: result.email });

  if (!user) {
    return res
      .status(401)
      .json({ status: "failed", message: "User does not exist" });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid password" });
  }

  user.name = name;
  user.lastName = lastName;

  user.save();

  return res
    .status(200)
    .json({ status: "success", data: { name, lastName, email: user.email } });
}

export default handler;
