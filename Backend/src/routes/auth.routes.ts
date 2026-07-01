import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { initiateAuth, verifyOtp, finalizeAuth, login, getMe, logout, refreshToken, resendOtp, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Brute Force Protection Limiter
const bruteForceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 requests per window
    message: { error: 'You have made too many failed attempts. For your security, this account has been temporarily locked. Please try again in 15 minutes.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/initiate', bruteForceLimiter, initiateAuth);
router.post('/verify', bruteForceLimiter, verifyOtp);
router.post('/finalize', finalizeAuth);
router.post('/login', bruteForceLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

router.post('/resend-otp', bruteForceLimiter, resendOtp);
router.post('/forgot-password', bruteForceLimiter, forgotPassword);
router.post('/reset-password', bruteForceLimiter, resetPassword);

// Protected Routes
router.get('/me', verifyToken, getMe);

export default router;
