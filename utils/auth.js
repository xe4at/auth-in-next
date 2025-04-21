import {hash} from "bcryptjs"

async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  console.log(hashedPassword); 
  return hashedPassword;
}

export { hashPassword };
