import attachCookiesToResponse from "../middlewares/attachCookiesToResponse.js";
import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ msg: "invalid credentials" });
  }
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ msg: "invalid credentials" });
  }

  const { password: hashPass, id, createdAt, ...info } = user;

  attachCookiesToResponse(user.id, res);
  return res.status(200).json({
    msg: "success",
    user: { ...info },
  });
};

const logout = (req, res) => {
  res.clearCookie("user").json({ msg: "logged out" });
};

const register = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Please provide all values" });
  }

  const emailAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "email already exists" });
  }

  const usernameAlreadyExists = await prisma.user.findUnique({
    where: { username },
  });
  if (usernameAlreadyExists) {
    return res.status(400).json({ msg: "username already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
    },
  });

  const { password: hashPass, id, createdAt, ...info } = user;

  attachCookiesToResponse(user.id, res);
  res.status(201).json({
    msg: "user created",
    user: { ...info },
  });
};

const update = async (req, res) => {
  const { userId } = req.user;

  const { name, email, username, avatar } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        name,
        avatar,
      },
    });
    const { password, createdAt, ...info } = user;
    return res
      .status(200)
      .json({ msg: "Updated successfully", user: { ...info } });
  } catch (err) {
    return res.status(400).json({ msg: "Something went wrong" });
  }
};

export { login, logout, register, update };
