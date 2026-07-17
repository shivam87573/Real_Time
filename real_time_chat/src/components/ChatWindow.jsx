import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiTrash2 } from "react-icons/fi"; // 👈 Delete icon import kiya

export default function ChatWindow({ messages }) {
  const chatEndRef = useRef(null);
  const { isTyping, typingUser, deleteMessage } = useChat();
  const [reactions, setReactions] = useState({});

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleDoubleClick = (msgId) => {
    setReactions((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === "❤️" ? null : "❤️",
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 relative custom-scrollbar h-full w-full">
      <div className="relative z-10 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-slate-500 gap-1">
            <span className="text-2xl">💬</span>
            <p className="text-xs font-medium">No messages yet. Start chatting!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSticker = msg.image && msg.message.length <= 4;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 group/msg ${
                  msg.own ? "justify-end" : "justify-start"
                }`}
              >
                {/* Delete Button Container - Shows up beautifully on hover */}
                {msg.own && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="opacity-0 group-hover/msg:opacity-100 order-first text-slate-500 hover:text-rose-500 transition duration-150 p-1 rounded bg-slate-900/40 border border-slate-800 text-[13px] self-center mr-1"
                    title="Delete Message"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}

                {!msg.own && (
                  <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold uppercase shrink-0 select-none shadow-sm">
                    {msg.username ? msg.username.substring(0, 2) : "??"}
                  </div>
                )}

                <div className="flex flex-col max-w-[75%] relative">
                  <span className={`text-[9px] mb-0.5 font-semibold ${msg.own ? "text-right text-blue-400" : "text-left text-slate-400"}`}>
                    {msg.username}
                  </span>

                  {isSticker ? (
                    <div 
                      onDoubleClick={() => handleDoubleClick(msg.id)}
                      className="text-5xl p-2 select-none animate-bounce relative cursor-pointer"
                      style={{ animationDuration: '2s' }}
                    >
                      {msg.image}
                      {reactions[msg.id] && (
                        <span className="absolute -bottom-1 right-0 bg-slate-800 border border-slate-750 text-[9px] rounded-full px-1 shadow-sm">
                          {reactions[msg.id]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(msg.id)}
                      className={`relative rounded-2xl px-3.5 py-2 text-xs shadow-md border transition-all duration-200 cursor-pointer select-none ${
                        msg.own
                          ? "bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-br-none border-blue-400/20"
                          : "bg-slate-900 text-slate-200 rounded-bl-none border-slate-800"
                      }`}
                    >
                      <p className="leading-relaxed break-words font-medium">{msg.message}</p>
                      <span className="block mt-0.5 text-[8px] opacity-60 text-right font-mono">{msg.time}</span>

                      {reactions[msg.id] && (
                        <span className="absolute -bottom-2 right-1.5 bg-slate-800 border border-slate-700 text-[9px] rounded-full px-1 shadow-sm">
                          {reactions[msg.id]}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Optional: Add delete for incoming bot messages too if you want admin privileges */}
                {!msg.own && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="opacity-0 group-hover/msg:opacity-100 order-last text-slate-600 hover:text-rose-500 transition duration-150 p-1 rounded bg-slate-900/40 border border-slate-800 text-[13px] self-center ml-1"
                    title="Delete Message"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}

              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex items-end gap-2 justify-start animate-pulse">
            <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
              {typingUser ? typingUser.substring(0, 2) : "..."}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] mb-0.5 font-semibold text-slate-400">{typingUser}</span>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-3 py-1.5 flex items-center gap-1 text-xs shadow-md">
                <span>typing</span>
                <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={chatEndRef} />
    </div>
  );
}