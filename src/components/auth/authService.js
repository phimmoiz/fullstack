import { default as jwt } from "jsonwebtoken";


export const getUserByToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error(err);
  }
};
