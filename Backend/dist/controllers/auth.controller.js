"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.resendOtp = exports.logout = exports.getMe = exports.login = exports.finalizeAuth = exports.verifyOtp = exports.initiateAuth = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = require("../services/email.service");
const prisma = new client_1.PrismaClient();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const initiateAuth = async (req, res) => {
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
        }
        else {
            // New user or unverified user
            await prisma.user.upsert({
                where: { email },
                update: { otp, otpExpires, firstName, lastName, mobileNumber },
                create: { email, firstName, lastName, mobileNumber, otp, otpExpires }
            });
        }
        await (0, email_service_1.sendOtpEmail)(email, otp);
        res.json({ message: 'OTP sent successfully', isExisting: !!(existingUser && existingUser.isVerified) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.initiateAuth = initiateAuth;
const verifyOtp = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyOtp = verifyOtp;
const finalizeAuth = async (req, res) => {
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
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                isVerified: true,
                otp: null,
                otpExpires: null
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ message: 'Authentication successful', user: { id: updatedUser.id, email: updatedUser.email, firstName: updatedUser.firstName } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.finalizeAuth = finalizeAuth;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isVerified || !user.password) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ message: 'Login successful', user: { id: user.id, email: user.email, firstName: user.firstName } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    }
    catch (error) {
        res.status(401).json({ error: 'Not authenticated' });
    }
};
exports.getMe = getMe;
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};
exports.logout = logout;
const resendOtp = async (req, res) => {
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
        await (0, email_service_1.sendOtpEmail)(email, otp);
        res.json({ message: 'OTP resent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.resendOtp = resendOtp;
const forgotPassword = async (req, res) => {
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
        await (0, email_service_1.sendOtpEmail)(email, otp);
        res.json({ message: 'Password reset OTP sent' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
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
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                otp: null,
                otpExpires: null
            }
        });
        res.json({ message: 'Password has been updated' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.resetPassword = resetPassword;
