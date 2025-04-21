import connectDB from "../../../../utils/connectDb";
import { hashPassword } from "../../../../utils/auth";

async function handler(req, res) {
  if (req.method === "POST") {
    return;
  }
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "failed", message: "Error connecting to DB" });
  }
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
  console.log(newUser);

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
}

export default handler;
