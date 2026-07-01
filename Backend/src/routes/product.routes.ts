import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/product.controller';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;
