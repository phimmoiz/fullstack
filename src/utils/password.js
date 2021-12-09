import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
