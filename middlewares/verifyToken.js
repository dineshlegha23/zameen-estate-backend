const verifyToken = (req, res, next) => {
  const token = res.cookies.user;
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(user);

  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(400).json({ msg: "invalid credentials" });
  }
};

export default verifyToken;
