import { verifyToken } from "../../../utils/auth";
import User from "../../../models/User";
import connectDB from "../../../utils/connectDb";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      status: "failed",
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("Server configuration error");
    }

    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ status: "failed", message: "You are not logged in!" });
    }

    const result = verifyToken(token, secretKey);

    if (result) {
      // Fetch user data from database
      const user = await User.findOne({ email: result.email });

      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      res.status(200).json({
        status: "success",
        data: {
          email: user.email,
          name: user.name || "",
          lastName: user.lastName || "",
        },
      });
    } else {
      res
        .status(401)
        .json({ status: "failed", message: "You are unauthorized" });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
}

export default handler;
