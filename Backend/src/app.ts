import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://my-sql-autuntication.vercel.app'],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);

export default app;
