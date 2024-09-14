import prisma from "../prisma/prismaClient.js";

const login = async (req, res) => {
  res.send("login working");
};

const logout = async (req, res) => {
  res.send("logout working");
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

  const user = await prisma.users.create({
    data: {
      email,
      username,
      password,
    },
  });
  console.log(emailAlreadyExists, usernameAlreadyExists);
  res.status(201).json({ msg: "user created", user });
};

export { login, logout, register };
