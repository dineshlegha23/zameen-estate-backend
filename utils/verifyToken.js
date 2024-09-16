import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export default verifyToken;
