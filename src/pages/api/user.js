import { verifyToken } from "../../../utils/auth";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      status: "failed",
      message: "Method not allowed",
    });
  }

  try {
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("Server configuration error");
    }

    const { token, userName, userLastName } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ status: "failed", message: "You are not logged in!" });
    }

    const result = verifyToken(token, secretKey);

    if (result) {
      res.status(200).json({
        status: "success",
        data: {
          ...result,
          name: userName || "",
          lastName: userLastName || "",
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
