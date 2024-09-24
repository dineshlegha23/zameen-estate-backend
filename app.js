import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.PROD_CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
// app.use("/api/users", userRoute);
// app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
