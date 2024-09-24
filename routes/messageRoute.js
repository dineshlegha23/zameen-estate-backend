import express from "express";
import authentication from "../middlewares/authentication.js";
import { addMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/:id", authentication, addMessage);

export default router;
