import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../ux/ToastProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Loader } from '../ui/Loader';
import { slideUp } from '../ux/transitions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
];

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
  const [countryCode, setCountryCode] = useState('+91');
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
  const { addToast } = useToast();

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
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
        setStep(2);
        setResendTimer(60);
        addToast('OTP sent to your email!', 'info');
      } else if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
        const user = res.data.user;
        setUser(user);
        addToast('Welcome back!', 'success');
        const normalizedRole = user.role?.trim().toUpperCase() || 'CUSTOMER';
        if (normalizedRole === 'SELLER') {
          navigate('/seller/dashboard');
        } else if (normalizedRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!/^\d{10}$/.test(mobileNumber)) {
          setError('Mobile number must be exactly 10 digits.');
          setLoading(false);
          return;
        }
        await axios.post(`${API_URL}/auth/initiate`, { firstName, lastName, mobileNumber: `${countryCode}${mobileNumber}`, email });
        setStep(2);
        setResendTimer(60);
        addToast('OTP sent to your email!', 'info');
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
      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      setResendTimer(60);
      addToast('OTP resent successfully', 'success');
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
      await axios.post(`${API_URL}/auth/verify`, { email, otp: code });
      setOtpStatus('success');
      addToast('Email verified successfully!', 'success');
      setTimeout(() => setStep(3), 800);
    } catch (err) {
      setOtpStatus('error');
      addToast('Invalid OTP. Please try again.', 'error');
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
        await axios.post(`${API_URL}/auth/reset-password`, { email, otp: otp.join(''), password });
        setIsForgotPassword(false);
        setIsLogin(true);
        setStep(1);
        setOtp(['', '', '', '', '', '']);
        setPassword('');
        setConfirmPassword('');
        addToast('Password reset successful! Please login.', 'success');
      } else {
        const res = await axios.post(`${API_URL}/auth/finalize`, { email, otp: otp.join(''), password }, { withCredentials: true });
        const user = res.data.user;
        setUser(user);
        addToast('Account created successfully!', 'success');
        if (user.role === 'SELLER') {
          navigate('/seller/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
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
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col items-center justify-center p-6 w-full"
    >
      <div className="glass-panel w-full max-w-md p-8 md:p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isForgotPassword ? (step === 1 ? 'Reset Password' : step === 2 ? 'Verify Email' : 'New Password') : (isLogin ? 'Welcome Back' : step === 1 ? 'Create Account' : step === 2 ? 'Verify Email' : 'Secure Account')}
          </h2>
          <p className="text-neutral-400 text-sm">
            {isForgotPassword ? (step === 1 ? 'Enter your email to reset your password' : step === 2 ? `We sent a code to ${email}` : 'Choose a new strong password') : (isLogin ? 'Enter your details to access your account' : step === 1 ? 'Start your journey with us today' : step === 2 ? `We sent a code to ${email}` : 'Choose a strong password')}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} className="mb-6" />
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
              onSubmit={handleInitiate}
              className="flex flex-col gap-5"
            >
              {!isLogin && !isForgotPassword && (
                <>
                  <div className="flex gap-4">
                    <Input label="First Name" placeholder="John" icon={User} required value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <Input label="Last Name" placeholder="Doe" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <div className="flex gap-3 items-end">
                    <div className="w-28 flex flex-col gap-1">
                      <label className="text-sm font-medium text-neutral-300 ml-1">Code</label>
                      <select 
                        className="glass-input cursor-pointer py-[13px] px-3 text-sm appearance-none" 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code} className="text-black">{c.flag} {c.code}</option>
                        ))}
                      </select>
                    </div>
                    <Input 
                      className="flex-1"
                      label="Mobile Number"
                      icon={Phone}
                      type="tel" 
                      placeholder="10 digits" 
                      required 
                      value={mobileNumber} 
                      onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    />
                  </div>
                </>
              )}
              
              <Input label="Email Address" icon={Mail} type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              
              {isLogin && !isForgotPassword && (
                <div className="relative">
                  <Input 
                    label="Password" 
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-neutral-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                      Forgot Password?
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" fullWidth isLoading={loading} className="mt-2">
                {isForgotPassword ? 'Send OTP' : isLogin ? 'Login' : 'Continue'}
              </Button>

              <div className="text-center mt-4 text-sm text-neutral-400">
                {isForgotPassword ? (
                  <button type="button" onClick={() => switchMode('login')} className="text-purple-400 hover:text-purple-300 font-semibold ml-1">
                    Back to Login
                  </button>
                ) : (
                  <>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button type="button" onClick={() => switchMode(isLogin ? 'signup' : 'login')} className="text-purple-400 hover:text-purple-300 font-semibold ml-1">
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
              className="flex flex-col items-center"
            >
              <div className="flex gap-2 sm:gap-3 mb-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { otpRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-black/20 border rounded-xl text-white outline-none transition-all
                      ${otpStatus === 'success' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                        otpStatus === 'error' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
                        'border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50'}`}
                  />
                ))}
              </div>
              
              {loading && <Loader size="sm" />}
              
              <div className="mt-6 text-center text-sm text-neutral-400">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <span className="text-white font-medium">{resendTimer}s</span></span>
                ) : (
                  <button type="button" onClick={handleResendOtp} disabled={loading} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
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
              className="flex flex-col gap-5"
            >
              <div className="relative">
                <Input 
                  label={isForgotPassword ? "New Password" : "Secure Password"} 
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-neutral-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <Input 
                label="Confirm Password" 
                icon={Lock}
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />

              <Button type="submit" fullWidth isLoading={loading} className="mt-4">
                {isForgotPassword ? 'Reset Password' : 'Complete Setup'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default Auth;
