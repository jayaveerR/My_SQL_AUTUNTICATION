import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../services/email.service';
import geoip from 'geoip-lite';

const prisma = new PrismaClient();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const initiateAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName, mobileNumber } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.isVerified) {
      res.status(400).json({ error: 'Already Signed Your Account Please Login Here' });
      return;
    } else {
      // New user or unverified user
      await prisma.user.upsert({
        where: { email },
        update: { otp, otpExpires, firstName, lastName, mobileNumber },
        create: { email, firstName, lastName, mobileNumber, otp, otpExpires }
      } as any);
    }

    await sendOtpEmail(email, otp);
    console.log(`\n\n-----------------------------\n🔑 OTP FOR ${email} IS: ${otp}\n-----------------------------\n\n`);
    res.json({ message: 'OTP sent successfully', isExisting: !!(existingUser && existingUser.isVerified) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ error: 'OTP expired' });
      return;
    }

    res.json({ message: 'OTP verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const finalizeAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ error: 'Invalid or expired session. Please start over.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Track Location and Device
    const ip = req.ip || req.connection.remoteAddress || '';
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown Location';
    const device = req.headers['user-agent'] || 'Unknown Device';

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        isVerified: true,
        otp: null,
        otpExpires: null,
        refreshToken,
        lastLoginIp: ip,
        lastLoginDevice: device,
        lastLoginLocation: location
      }
    });

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ message: 'Authentication successful', user: { 
      id: updatedUser.id, 
      email: updatedUser.email, 
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      lastLoginIp: updatedUser.lastLoginIp,
      lastLoginDevice: updatedUser.lastLoginDevice,
      lastLoginLocation: updatedUser.lastLoginLocation
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    const rateLimitInfo = (req as any).rateLimit;
    const attemptStr = rateLimitInfo ? `(Attempt ${rateLimitInfo.current}/${rateLimitInfo.limit})` : '';

    if (!user || !user.isVerified || !user.password) {
      res.status(401).json({ error: `Invalid credentials ${attemptStr}`.trim() });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: `Invalid credentials ${attemptStr}`.trim() });
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

    // Track Location and Device
    const ip = req.ip || req.connection.remoteAddress || '';
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown Location';
    const device = req.headers['user-agent'] || 'Unknown Device';

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken,
        lastLoginIp: ip,
        lastLoginDevice: device,
        lastLoginLocation: location
      }
    });

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, createdAt: user.createdAt } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.json({ user: { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      role: user.role,
      createdAt: user.createdAt,
      lastLoginIp: user.lastLoginIp,
      lastLoginDevice: user.lastLoginDevice,
      lastLoginLocation: user.lastLoginLocation
    } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // Decode enough to get userId without verifying expiration (just in case)
      const decoded = jwt.decode(refreshToken) as { userId: number } | null;
      if (decoded?.userId) {
        await prisma.user.updateMany({
          where: { id: decoded.userId, refreshToken },
          data: { refreshToken: null }
        });
      }
    }
  } catch (error) {
    // Ignore errors during logout
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { userId: number };
    
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, refreshToken: token }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires }
    });

    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isVerified) {
      res.status(404).json({ error: 'Verified account with this email not found' });
      return;
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires }
    });

    await sendOtpEmail(email, otp);
    res.json({ message: 'Password reset OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ error: 'Invalid or expired OTP.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpires: null
      }
    });

    res.json({ message: 'Password has been updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
