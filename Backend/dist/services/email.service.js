"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
    },
});
const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"${process.env.GMAIL_NAME}" <${process.env.GMAIL_ACCOUNT}>`,
        to,
        subject: 'Your Authentication Code',
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .header { background-color: #aa3bff; padding: 30px 20px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .content { padding: 40px 30px; color: #333333; }
          .content p { font-size: 16px; line-height: 1.6; margin: 0 0 20px; }
          .otp-box { background-color: #f8f9fa; border: 2px dashed #aa3bff; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 32px; font-weight: 700; color: #aa3bff; letter-spacing: 6px; margin: 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #888888; font-size: 14px; border-top: 1px solid #eeeeee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Secure Authentication</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to access your account. Please use the following One-Time Password (OTP) to complete your secure authentication:</p>
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>
            <p>This code is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.</p>
            <p>If you did not request this, please safely ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.GMAIL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOtpEmail = sendOtpEmail;
