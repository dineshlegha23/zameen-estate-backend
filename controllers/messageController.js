import prisma from "../prisma/prismaClient.js";

export const addMessage = async (req, res) => {
  const { userId } = req.user;
  const { id: chatId } = req.params;
  const { text } = req.body;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [userId],
        },
      },
    });
    if (!chat) return res.status(404).json({ msg: "Chat not found" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [userId],
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to add message" });
  }
};
