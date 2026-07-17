import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiSearch, FiUser, FiHash, FiInfo, FiPlus, FiLogOut } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";

export default function Sidebar() {
  // ⚡ FIX: Added logout method extract from context hook
  const { activeChat, setActiveChat, usersList, groupsList, channelsList, createNewGroup, user, logout } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const filteredUsers = usersList.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createNewGroup(newGroupName);
      setNewGroupName("");
      setShowGroupPopup(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#111827] flex flex-col justify-between select-none border-r border-slate-800/80 relative">
      
      {/* ➕ Create Group Popup Modal Container */}
      {showGroupPopup && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl w-full max-w-xs space-y-4 shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create New Group</h3>
            <form onSubmit={handleGroupSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Enter group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full bg-slate-950 text-xs border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition placeholder-slate-600"
                required
              />
              <div className="flex justify-end gap-2 text-[11px] font-semibold">
                <button type="button" onClick={() => setShowGroupPopup(false)} className="px-3 py-1.5 text-slate-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition shadow-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">ChatFlow</h1>
        </div>

        {/* Capsule Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users or groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937]/50 border border-slate-700/60 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-slate-600 transition pr-9"
          />
          <FiSearch className="absolute right-3 top-3.5 text-slate-400" size={13} />
        </div>

        {/* 👪 Groups Section Area List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-xs tracking-wide px-1">
            <div className="flex items-center gap-1.5">
              <HiOutlineUserGroup size={14} className="text-slate-400" />
              <span>Groups ({groupsList.length})</span>
            </div>
            <button onClick={() => setShowGroupPopup(true)} className="p-1 hover:text-white transition rounded-md hover:bg-slate-800" title="Create New Group">
              <FiPlus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {groupsList.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveChat(g.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition font-medium ${
                  activeChat === g.id ? "bg-[#1F2937] text-white" : "text-slate-400 hover:bg-[#1F2937]/40"
                }`}
              >
                <span className="text-blue-400 text-sm font-bold">👥</span>
                <span className="flex-1 truncate text-slate-200">{g.name}</span>
                {/* ⚡ FIX: Fixed group members count mapping based on core context arrays */}
                <span className="text-[9px] bg-slate-950/60 text-slate-500 px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0">
                  {g.members ? g.members.length : 0}m
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 👥 Active DMs Section with Online/Offline State */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold tracking-wide text-xs px-1">
            <FiUser size={14} />
            <span>Direct Messages</span>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setActiveChat(u.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition ${
                  activeChat === u.id ? "bg-[#1F2937] text-white" : "text-slate-300 hover:bg-[#1F2937]/40"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase text-white shrink-0 ${u.color} shadow-sm`}>
                  {u.name.substring(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{u.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${u.isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className="text-[9px] text-slate-400 font-medium">{u.isOnline ? 'Active' : 'Offline'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 💬 Channels Area */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold tracking-wide text-xs px-1">
            <FiHash size={14} />
            <span>Channels</span>
          </div>
          <div className="space-y-0.5">
            {channelsList.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChat(ch.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition text-xs font-medium ${
                  activeChat === ch.id ? "bg-[#1F2937] text-white" : "text-slate-400 hover:bg-[#1F2937]/40"
                }`}
              >
                <span className="text-slate-500 font-bold text-sm">#</span>
                <span className="flex-1 truncate text-slate-300">{ch.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Meta Profiler */}
      <div className="p-4 bg-[#0B0F19]/40 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-2">
        {/* ⚡ UPDATED: Integrated a clean professional Logout trigger option here */}
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-300">Active User: <span className="text-blue-400 font-bold capitalize">{user?.name}</span></p>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to log out of your session?")) {
                logout();
              }
            }}
            className="p-1 hover:text-rose-400 text-slate-400 transition rounded-md hover:bg-slate-800 flex items-center justify-center" 
            title="Logout Session"
          >
            <FiLogOut size={13} />
          </button>
        </div>
        
        <button className="w-full flex items-center gap-2 px-3 py-2 bg-[#1F2937]/40 border border-slate-800 rounded-xl text-left text-xs text-slate-400 hover:bg-[#1F2937] hover:text-white transition font-medium">
          <FiInfo size={13} />
          <span>System Dashboard Info</span>
        </button>
      </div>

    </div>
  );
}