import bcrypt, { genSalt } from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
};

export const compareHash = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
