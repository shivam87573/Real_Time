import React, { useState } from "react";
import { useChat } from "../context/ChatContext"; // Path check kar lena apne project ke hisab se

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const { login } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050714] px-4 font-sans relative overflow-hidden select-none">
      
      {/* 🔮 Background Abstract Glowing Spheres (Exactly as shown) */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/20 blur-[80px] pointer-events-none" />
      <div className="absolute top-[15%] left-[-8%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 border border-indigo-500/20 pointer-events-none shadow-[0_0_50px_rgba(79,70,229,0.15)]" />
      
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-blue-500/15 border border-blue-500/10 pointer-events-none" />

      <div className="absolute bottom-[10%] left-[-5%] w-[200px] h-[200px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />

      {/* Grid Pattern Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-col items-center w-full max-w-lg z-10">
        
        {/* 🏷️ Top Mini Capsule Header */}
        <div className="mb-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <span className="text-yellow-400 text-xs">⚡</span>
          <span className="text-xs font-bold text-slate-300 tracking-wide font-sans">ChatFlow</span>
        </div>

        {/* 🛡️ Premium Glassmorphism Main Card */}
        <div 
          className="w-full rounded-[32px] border bg-[#0d1127]/60 p-10 md:p-12 backdrop-blur-2xl transition-all duration-300"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.05)"
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col items-center text-center">
            
            {/* Outer Glowing Ring */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 relative shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              {/* Inner Circle */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111633] border border-indigo-500/30">
                <span className="text-3xl text-yellow-400 filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]">⚡</span>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-3xl">
              Welcome to ChatFlow
            </h2>
            <p className="mt-2.5 text-sm text-slate-400 font-medium max-w-[340px] leading-relaxed">
              Your workspace for seamless real-time conversations
            </p>

            {/* Micro Dot Divider */}
            <div className="w-full flex items-center justify-center my-6">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-indigo-500/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 mx-2 animate-pulse" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-indigo-500/30" />
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              
              {/* Input Container with User Icon */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.8" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your workspace title or profile handle"
                  className="w-full rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(10, 13, 30, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.1rem 1.25rem 1.1rem 3.25rem",
                    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.6)";
                    e.target.style.boxShadow = "0 0 15px rgba(99, 102, 241, 0.15), inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)";
                  }}
                />
              </div>
              {/* Inline Under-Input Example Subtext */}
              <div className="px-4">
                <span className="text-[11px] text-slate-500 font-medium">e.g. suraj</span>
              </div>
            </div>

            {/* Launch Button with Rocket Icon and Gradient */}
            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #2563eb 100%)",
                padding: "1.1rem",
                boxShadow: "0 12px 24px -5px rgba(99, 102, 241, 0.45)",
                border: "none",
                cursor: "pointer"
              }}
            >
              <svg 
                className="w-4 h-4 text-white transform group-hover:rotate-12 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.65 8.41a14.98 14.98 0 00-6.16 12.12c2.3 0 4.43-.87 6.07-2.3m5.84-2.58a14.98 14.98 0 01-6.07-2.3m0 0L3.58 3.58" />
              </svg>
              <span>LAUNCH CORE INSTANCE</span>
            </button>
          </form>

          {/* Bottom Indicators Section */}
          <div className="mt-8 flex items-center justify-center gap-6 border-t border-slate-800/60 pt-6">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-yellow-400 text-xs">⚡</span>
              <span className="text-[10px] font-bold tracking-wider font-mono">Fast</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-blue-400 text-xs">🛡️</span>
              <span className="text-[10px] font-bold tracking-wider font-mono">Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-purple-400 text-xs">((•))</span>
              <span className="text-[10px] font-bold tracking-wider font-mono">Real-time</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}