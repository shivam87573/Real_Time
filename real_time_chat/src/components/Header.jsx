import { useChat } from "../context/ChatContext";

export default function Header({ activeDetails }) {
  const { isTyping, typingUser } = useChat();

  // Agar typing chal rahi hai toh header ka status override kar do
  const isCurrentlyTypingThisChat = isTyping && activeDetails.name.includes(typingUser);

  return (
    <div className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          {activeDetails.name}
        </h2>
        <p className={`text-xs ${isCurrentlyTypingThisChat ? "text-green-400 font-semibold animate-pulse" : "text-slate-400"}`}>
          {isCurrentlyTypingThisChat ? `✏️ ${typingUser} is typing...` : activeDetails.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition">
          View Info
        </button>
      </div>
    </div>
  );
}