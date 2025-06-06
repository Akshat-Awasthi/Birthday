import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export const PasswordPage = ({ onCorrectPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const correctPassword = 'chutki-pglet';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setError(false);
      onCorrectPassword();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white text-center">
            Enter Password
          </h1>
          <p className="mt-2 text-white/70 text-center text-sm sm:text-base">
            Please enter the password to view this special celebration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setError(false);
                setPassword(e.target.value);
              }}
              className={`w-full px-4 py-3 bg-white/20 border ${
                error ? 'border-red-400' : 'border-white/30'
              } rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Enter password"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all active:scale-[0.98]"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};