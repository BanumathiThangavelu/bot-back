import Message from '../models/postModel.js';
import { getBotReply } from '../services/botService.js';
import { generateSupportId } from '../utils/generateSupportId.js';

//send Message
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    const userMessage = await Message.create({
      userId,
      message,
      sender: 'USER',
    });

    const botReply = getBotReply(message);

    let supportId = null;
    if (/order|return|refund/i.test(message)) {
      supportId = generateSupportId(userId);
    }
    const botMessage = await Message.create({
      userId,
      message: botReply,
      sender: 'BOT',
      supportId,
    });

    res.status(200).json({
      userMessage,
      botMessage,
    });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Get Chat History
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
