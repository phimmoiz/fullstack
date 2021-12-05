import bcrypt from "bcrypt";

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
