import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import chatRoutes from './routes/chat.routes';

import { csrfProtection } from './middleware/csrf.middleware';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://my-sql-autuntication.vercel.app'],
  credentials: true
}));

// Apply CSRF Protection to all routes
app.use(csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chat', chatRoutes);

export default app;
