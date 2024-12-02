import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '6d' });
};

export const ValidateSignature = async (req) => {
  const token = req.get('Authorization');

  if (token) {
    try {
      const payload = await jwt.verify(token.split(' ')[ 1 ], process.env.SECRET_KEY);
      req.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};
