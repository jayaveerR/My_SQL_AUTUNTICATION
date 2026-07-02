import { Router } from 'express';
import { chatWithAI, getChatHistory, uploadChatFile } from '../controllers/chat.controller';
import { verifyToken } from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint: GET /api/chat/history
router.get('/history', verifyToken, getChatHistory);

// Endpoint: POST /api/chat/upload
router.post('/upload', verifyToken, upload.single('file'), uploadChatFile);

// Endpoint: POST /api/chat
router.post('/', verifyToken, chatWithAI);

export default router;
