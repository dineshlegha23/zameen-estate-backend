import prisma from "../prisma/prismaClient.js";

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json({ total: posts.length, posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;

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

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed to get post" });
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

export { getPosts, addPost, getPost, updatePost, deletePost };
