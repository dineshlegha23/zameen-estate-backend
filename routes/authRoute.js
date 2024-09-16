import express from "express";
import {
  login,
  logout,
  register,
  update,
} from "../controllers/authController.js";
import authentication from "../middlewares/authentication.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.patch("/update", authentication, update);

export default router;
