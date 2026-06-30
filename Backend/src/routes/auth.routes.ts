import { Router } from 'express';
import { initiateAuth, verifyOtp, finalizeAuth, login, getMe, logout, resendOtp, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/initiate', initiateAuth);
router.post('/verify', verifyOtp);
router.post('/finalize', finalizeAuth);
router.post('/login', login);
router.get('/me', getMe);
router.post('/logout', logout);

router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
