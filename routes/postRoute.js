import express from "express";
import {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authentication from "../middlewares/authentication.js";
const router = express.Router();

router.route("/").get(getPosts).post(authentication, addPost);
router
  .route("/:id")
  .get(getPost)
  .put(authentication, updatePost)
  .delete(authentication, deletePost);

export default router;
