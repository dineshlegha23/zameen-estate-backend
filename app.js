import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import authRoute from "./routes/authRoute.js";

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/test", testRoute);
// app.use("/api/chats", chatRoute);
// app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
