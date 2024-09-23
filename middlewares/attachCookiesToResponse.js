import jwt from "jsonwebtoken";

const attachCookiesToResponse = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);
  return res.cookie("token", token, {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.PROD_CLIENT_URL || false,
    domain: process.env.PROD_CLIENT_URL || process.env.CLIENT_URL,
  });
};

export default attachCookiesToResponse;
