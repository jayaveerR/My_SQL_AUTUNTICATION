import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLogin, setIsLogin] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpStatus, setOtpStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isForgotPassword) {
        await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
        setStep(2);
        setResendTimer(60);
      } else if (isLogin) {
        // Login Flow
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }, { withCredentials: true });
        setUser(res.data.user);
        navigate('/dashboard');
      } else {
        // Signup Flow Step 1
        await axios.post('http://localhost:5000/api/auth/initiate', { firstName, lastName, mobileNumber, email });
        setStep(2);
        setResendTimer(60);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      setResendTimer(60);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to resend OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpStatus('idle');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/verify', { email, otp: code });
      setOtpStatus('success');
      setTimeout(() => setStep(3), 800);
    } catch (err) {
      setOtpStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.join('').length === 6) {
      verifyOtp();
    }
  }, [otp]);

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isForgotPassword) {
        await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp: otp.join(''), password });
        setIsForgotPassword(false);
        setIsLogin(true);
        setStep(1);
        setOtp(['', '', '', '', '', '']);
        setPassword('');
        setConfirmPassword('');
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/finalize', { email, otp: otp.join(''), password }, { withCredentials: true });
        setUser(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: 'login' | 'signup') => {
    setIsForgotPassword(false);
    setIsLogin(mode === 'login');
    setError('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px', overflow: 'hidden' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
          {isForgotPassword ? (step === 1 ? 'Reset Password' : step === 2 ? 'Verify Email' : 'New Password') : (isLogin ? 'Welcome Back' : step === 1 ? 'Create Account' : step === 2 ? 'Verify Email' : 'Secure Account')}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>
          {isForgotPassword ? (step === 1 ? 'Enter your email to reset your password' : step === 2 ? `We sent a code to ${email}` : 'Choose a new strong password') : (isLogin ? 'Enter your details to access your account' : step === 1 ? 'Start your journey with us today' : step === 2 ? `We sent a code to ${email}` : 'Choose a strong password')}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              onSubmit={handleInitiate}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {!isLogin && !isForgotPassword && (
                <>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input className="input-field" placeholder="First Name *" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <input className="input-field" placeholder="Last Name *" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <input className="input-field" type="tel" placeholder="Mobile Number *" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
                </>
              )}
              <input className="input-field" type="email" placeholder="Email Address *" required value={email} onChange={e => setEmail(e.target.value)} />
              
              {isLogin && !isForgotPassword && (
                <div style={{ position: 'relative' }}>
                  <input className="input-field" type={showPassword ? 'text' : 'password'} placeholder="Password *" required value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px' }}>
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isForgotPassword ? 'Send OTP' : isLogin ? 'Login' : 'Continue')}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                {isForgotPassword ? (
                  <button type="button" onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                    Back to Login
                  </button>
                ) : (
                  <>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => switchMode(isLogin ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                      {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                  </>
                )}
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div className="otp-container">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { otpRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className={`otp-input ${otpStatus === 'success' ? 'success' : otpStatus === 'error' ? 'error' : ''}`}
                  />
                ))}
              </div>
              {loading && <Loader2 className="animate-spin" style={{ color: 'var(--accent)', marginTop: '16px' }} />}
              
              <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                {resendTimer > 0 ? (
                  <span>Resend OTP in {resendTimer}s</span>
                ) : (
                  <button type="button" onClick={handleResendOtp} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form 
              key="step3"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              onSubmit={handleFinalize}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPassword ? 'text' : 'password'} placeholder={isForgotPassword ? "New Password *" : "Password *"} required value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password *" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isForgotPassword ? 'Reset Password' : 'Confirm')}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Auth;
