import { Router } from 'express';
import { getCategories } from '../controllers/category.controller';

const router = Router();

// Public routes
router.get('/', getCategories);

export default router;
