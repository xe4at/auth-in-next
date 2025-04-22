import User from "../../../../models/User";
import connectDB from "../../../../utils/connectDb";

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
}

export default handler;
