import { useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { useChat } from "../context/ChatContext";

// 🚀 100% Foolproof Native SVG/Vector Stickers Layout (No URL, No Broken Images!)
const funMemes = [
  { name: "Mind Blown", emoji: "🤯" },
  { name: "Partying Face", emoji: "🥳" },
  { name: "Tears of Joy", emoji: "😂" },
  { name: "Cool Sunglasses", emoji: "😎" },
  { name: "Hot Face (Fire)", emoji: "🥵" },
  { name: "Screaming Fear", emoji: "😱" },
  { name: "Thinking Face", emoji: "🤔" },
  { name: "Smiling Heart", emoji: "🥰" },
  { name: "Heart Eyes", emoji: "😍" }, // 👈 Ab absolute foolproof native emoji!
  { name: "Sparkle Heart", emoji: "💖" } // 👈 Kabhi crash nahi hoga!
];

export default function MessageInput({ onSendMessage }) {
  const [text, setText] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const { quickReplies } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  const handleSendEmojiSticker = (emoji, name) => {
    // Message context stream ke andar bada sticker format render karne ke liye text aur type pass karein
    onSendMessage(`${emoji}`, emoji); 
    setShowAttachments(false);
  };

  return (
    <div className="bg-[#0F172A] px-6 py-4 w-full flex-shrink-0 border-t border-slate-800/60 relative">
      
      {/* 🖼️ Emojis Sticker Panel Box container overlay */}
      {showAttachments && (
        <div className="absolute bottom-24 left-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl w-85 z-50">
          <p className="text-xs text-blue-400 font-bold tracking-wide uppercase mb-3">Premium Stickers</p>
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {funMemes.map((meme, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSendEmojiSticker(meme.emoji, meme.name)}
                className="group relative h-20 w-full overflow-hidden rounded-lg cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-500 flex flex-col items-center justify-center p-2 transition active:scale-95 text-center"
              >
                {/* 💥 Dynamic Large Avatar Vector Emoji Grid */}
                <span className="text-3xl select-none filter drop-shadow-sm">{meme.emoji}</span>
                <span className="text-[9px] mt-1.5 font-semibold text-slate-400 text-center">{meme.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Replies row */}
      <div className="flex flex-wrap gap-2 mb-3 max-w-7xl mx-auto">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(reply)}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 border border-slate-700 hover:bg-blue-600 hover:text-white transition"
          >
            {reply}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => setShowAttachments(!showAttachments)}
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-800 text-slate-400 hover:text-white transition ${showAttachments ? 'bg-blue-600 text-white' : 'bg-[#1F2937]/60'}`}
        >
          <FiPaperclip size={16} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl bg-[#111827] border border-slate-800/80 px-4 py-3 text-white text-sm outline-none focus:border-slate-700 transition min-w-0 placeholder-slate-500"
        />
        
        <button type="submit" className="flex h-11 px-5 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 font-semibold text-white hover:bg-blue-500 transition text-sm shadow-md">
          <FiSend size={14} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}