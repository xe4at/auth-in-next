import { sign } from "jsonwebtoken";
import User from "../../../../models/User";
import { verifyPassword } from "../../../../utils/auth";
import connectDB from "../../../../utils/connectDb";
import { serialize } from "cookie";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", message: "Error connecting to DB" });
  }

  const { email, password } = req.body;
  const secretKey = process.env.SECRET_KEY;
  const expiresIn = 24 * 60 * 60;

  if (!email || !password) {
    return res.status(422).json({
      status: "failed",
      message: "Invalid email or password",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return res.status(422).json({
      status: "failed",
      message: "Username or password is incorrect",
    });
  }

  const token = sign({ email }, secretKey, {
    expiresIn: expiresIn,
  });

  const serializedCookie = serialize("token", token, {
    httpOnly: true,
    maxAge: expiresIn,
    path: "/",
  });

  res
    .status(200)
    .setHeader("Set-Cookie", serializedCookie)
    .json({
      status: "success",
      message: "Logged in!",
      data: { email: user.email },
    });
}

export default handler;
