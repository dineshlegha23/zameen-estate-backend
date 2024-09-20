import prisma from "../prisma/prismaClient.js";
import verifyToken from "../utils/verifyToken.js";

const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 99999,
        },
      },
    });
    res.status(200).json({ total: posts.length, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  if (token) {
    try {
      const { userId } = verifyToken(token);
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: { username: true, avatar: true },
          },
        },
      });
      const saved = await prisma.savedPost.findUnique({
        where: { userId_postId: { userId, postId: id } },
      });

      return res.status(200).json({ ...post, isSaved: saved ? true : false });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: { username: true, avatar: true },
          },
        },
      });

      if (!post) {
        return res.status(404).json({ msg: "No post found with this id" });
      }

      return res.status(200).json({ ...post, isSaved: false });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Failed to get post" });
    }
  }
};

const addPost = async (req, res) => {
  const body = req.body;
  const { userId } = req.user;

  try {
    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  res.send("update post");
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await prisma.post.delete({
      where: { id },
    });
    res.status(204).json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to delete post" });
  }
};

const savePost = async (req, res) => {
  const { userId } = req.user;
  const { id: postId } = req.params;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      res.status(200).json({ msg: "Post unsaved" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      res.status(201).json({ msg: "Post saved" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Failed to save/unsave post" });
  }
};

const userPosts = async (req, res) => {
  const { userId } = req.user;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
    });

    let savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      include: { post: true },
    });

    savedPosts = savedPosts.map((post) => post.post);

    res.status(200).json({ posts, savedPosts });
  } catch (error) {
    res.status(500).json({ msg: "Failed to get user posts" });
  }
};

export {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
  savePost,
  userPosts,
};
