import { Router } from 'express';
import { chatWithAI } from '../controllers/chat.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Endpoint: POST /api/chat
// Protected to prevent unauthorized API spam
router.post('/', verifyToken, chatWithAI);

export default router;
