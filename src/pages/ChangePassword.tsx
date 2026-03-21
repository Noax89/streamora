import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { changePassword, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await changePassword(password);
      alert("Password updated successfully");
      navigate('/');
    } catch (error) {
      console.error('Password change failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="bg-brand/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-white">Change Password</h1>
          <p className="text-gray-400 mt-2">Secure your account with a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {!user && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-500 leading-relaxed">
                You are currently not signed in. Changing password will require email verification.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>

          <button 
            type="button"
            onClick={() => navigate(-1 as any)}
            className="w-full text-sm text-gray-500 hover:text-white transition-colors"
          >
            Cancel and go back
          </button>
        </form>
      </motion.div>
    </div>
  );
};
