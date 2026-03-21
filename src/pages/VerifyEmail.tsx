import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail = () => {
  const { user, verifyEmail, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    await verifyEmail();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-brand/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldCheck className="w-10 h-10 text-brand" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Verify Your Email</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          We've sent a verification link to <span className="text-white font-bold">{user.email}</span>. 
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
            <Mail className="w-6 h-6 text-brand shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Check your inbox</p>
              <p className="text-xs text-gray-500">The link expires in 24 hours</p>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'I have verified my email'}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <button className="text-sm text-gray-500 hover:text-brand transition-colors">
            Didn't receive the email? Resend link
          </button>
        </div>
      </motion.div>
    </div>
  );
};
