import React, { useState } from 'react';
import { UserCircle } from 'lucide-react';

interface WelcomeProps {
  onSubmit: (name: string) => void;
}

export function Welcome({ onSubmit }: WelcomeProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2940')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen backdrop-blur-sm bg-gradient-to-br from-indigo-900/80 to-purple-900/80 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white/10 rounded-full p-4">
                <UserCircle className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome!</h1>
            <p className="text-white/80 text-lg">Let's start by getting to know you</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-white/80">
                What's your name?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
            >
              Get Started →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}