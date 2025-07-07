import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  sender: { type: String, enum: ['USER', 'BOT'] },
  supportId: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', MessageSchema);
export default Message;
