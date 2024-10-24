import * as argon from 'argon2';

export const hashPassword = async (password: string) => {
  return await argon.hash(password);
};

export const verifyPassword = async (digest: string, password: string) => {
  return await argon.verify(digest, password);
};
