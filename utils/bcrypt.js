import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT) || 10
  );
  return hashedPassword;
};

const comparePassword = async (currentPassword, savedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    savedPassword
  );
  if (isPasswordCorrect) {
    return true;
  } else {
    return false;
  }
};

export { hashPassword, comparePassword };
