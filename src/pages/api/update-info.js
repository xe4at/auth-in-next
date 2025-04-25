import User from "../../../models/User";
import { verifyPassword, verifyToken } from "../../../utils/auth";
import connectDB from "../../../utils/connectDb";
import { serialize } from "cookie";

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

  await user.save();

  // Set cookies for name and last name
  const nameCookie = serialize("userName", name, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  const lastNameCookie = serialize("userLastName", lastName, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  res
    .status(200)
    .setHeader("Set-Cookie", [nameCookie, lastNameCookie])
    .json({ status: "success", data: { name, lastName, email: user.email } });
}

export default handler;
