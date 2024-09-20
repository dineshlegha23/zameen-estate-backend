import express from "express";
import {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
  savePost,
  userPosts,
} from "../controllers/postController.js";
import authentication from "../middlewares/authentication.js";
const router = express.Router();

router.route("/").get(getPosts).post(authentication, addPost);
router.get("/users/posts", authentication, userPosts);
router
  .route("/:id")
  .get(getPost)
  .put(authentication, updatePost)
  .delete(authentication, deletePost)
  .post(authentication, savePost);

export default router;
