import verifyToken from "../utils/verifyToken.js";

const authentication = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ msg: "Unauthenticated" });
  }

  try {
    const { userId } = verifyToken(token);
    req.user = { userId };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthenticated" });
  }
};

export default authentication;
