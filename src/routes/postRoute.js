import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/postController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', verifyToken, sendMessage);
router.get('/history', verifyToken, getChatHistory);

export default router;
