import bcrypt from 'bcrypt';

export const hashPassword = async (plain: string) => {
  const saltRounds = 5;
  const hash = await bcrypt.hash(plain, saltRounds);
  return hash;
}

export const comparePassword = async (plain: string, hash: string) => {
  const isMatch = await bcrypt.compare(plain, hash);
  return isMatch;
}