import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  // Methods that are safe and don't need CSRF check
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  // If cookie doesn't exist, generate one
  let xsrfToken = req.cookies['XSRF-TOKEN'];
  if (!xsrfToken) {
    xsrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', xsrfToken, {
      httpOnly: false, // Must be readable by frontend JS to set the header
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Check CSRF token for unsafe methods
  const headerToken = req.headers['x-xsrf-token'];
  
  if (!headerToken || headerToken !== xsrfToken) {
    res.status(403).json({ error: 'CSRF token validation failed' });
    return;
  }

  next();
};
