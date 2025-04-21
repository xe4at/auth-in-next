import connectDB from "../../../../utils/connectDb";
import { hashPassword } from "../../../../utils/auth";
import User from "../../../../models/User";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "failed",
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        status: "failed",
        message: "Invalid Data",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({
        status: "failed",
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });
    console.log(newUser)

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        email: newUser.email,
        id: newUser._id,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Error in creating user" });
  }
}

export default handler;
