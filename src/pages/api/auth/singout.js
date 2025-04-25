import { serialize } from "cookie";

async function handler(req, rew) {
  if (req.method !== "GET") return;

  const serialized = serialize("token", "", { path: "/", maxAge: 0 });

  res
    .status(200)
    .setHeader("Set-Cookie", serialize)
    .json({ status: "success", message: "Loged Out " });
}

export default handler;
