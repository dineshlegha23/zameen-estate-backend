import jwt from "jsonwebtoken";

const attachCookiesToResponse = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);
  return res.cookie("token", token, {
    httpOnly: true,
    sameSite: "None",
  });
};

export default attachCookiesToResponse;
