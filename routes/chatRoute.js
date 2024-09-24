import express from "express";
import authentication from "../middlewares/authentication.js";
import {
  addChat,
  getChat,
  getChats,
  readChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", authentication, getChats);
router.get("/:id", authentication, getChat);
router.post("/", authentication, addChat);
router.put("/read/:id", authentication, readChat);

export default router;
