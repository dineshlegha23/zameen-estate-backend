import attachCookiesToResponse from "../middlewares/attachCookiesToResponse.js";
import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ msg: "invalid credentials" });
  }
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ msg: "invalid credentials" });
  }

  attachCookiesToResponse(user._id, res);
  return res.status(200).json({
    msg: "success",
    user: { email: user.email, username: user.username, avatar: user.avatar },
  });
};

const logout = async (req, res) => {
  res.clearCookie("user").json({ msg: "logged out" });
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please provide all values" });
  }

  const emailAlreadyExists = await prisma.users.findUnique({
    where: { email },
  });

  if (emailAlreadyExists) {
    return res.status(400).json({ msg: "email already exists" });
  }

  const usernameAlreadyExists = await prisma.users.findUnique({
    where: { username },
  });
  if (usernameAlreadyExists) {
    return res.status(400).json({ msg: "username already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.users.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  attachCookiesToResponse(user._id, res);
  res.status(201).json({
    msg: "user created",
    user: { email: user.email, username: user.username, avatar: user.avatar },
  });
};

export { login, logout, register };
