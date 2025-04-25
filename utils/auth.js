import { hash, compare } from "bcryptjs";
import { verify } from "jsonwebtoken";

async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  console.log(hashedPassword);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  console.log(isValid);
  return isValid;
}

function verifyToken(token, secretKey) {
  try {
    const result = verify(token, secretKey);
    return {
      email: result.email,
      id: result.id || null, // Ensure id is null if not present
    };
  } catch (err) {
    return false;
  }
}

export { hashPassword, verifyPassword, verifyToken };
