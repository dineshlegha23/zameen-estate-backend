import jwt from "jsonwebtoken";

const attachCookiesToResponse = (data, res) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET_KEY);
  return res.cookie("user", token);
};

export default attachCookiesToResponse;
