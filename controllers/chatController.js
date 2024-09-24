import prisma from "../prisma/prismaClient.js";

export const getChats = async (req, res) => {
  const { userId } = req.user;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [userId],
        },
      },
    });
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const { userId } = req.user;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }
    if (chat.seenBy.find((id) => id === userId)) {
      return res.status(200).json(chat);
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const { userId } = req.user;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [userId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const { userId } = req.user;
  try {
    const oldchat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
    });
    if (oldchat.seenBy.indexOf(userId) !== -1) {
      return res.status(200).json(oldchat);
    }

    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to read chat" });
  }
};
