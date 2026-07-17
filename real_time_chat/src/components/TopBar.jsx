import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { FiUserPlus, FiUsers, FiMessageSquare, FiHash, FiEdit2, FiShield, FiX } from "react-icons/fi";

export default function TopBar() {
  const { 
    activeChat, 
    groupsList, 
    usersList, 
    channelsList, 
    addMemberToGroup,
    updateGroupName,
    makeGroupAdmin,
    removeMemberFromGroup
  } = useChat();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const isGroup = activeChat.startsWith("group-");
  const isDM = activeChat.startsWith("user-");

  let currentTitle = "General Workspace";
  let activeIcon = <FiHash className="text-slate-400" size={16} />;
  let currentGroupObj = null;

  if (isGroup) {
    currentGroupObj = groupsList.find(g => g.id === activeChat);
    currentTitle = currentGroupObj ? currentGroupObj.name : "Group Chat";
    activeIcon = <FiUsers className="text-blue-400" size={16} />;
  } else if (isDM) {
    const matchedUser = usersList.find(u => u.id === activeChat);
    currentTitle = matchedUser ? matchedUser.name : "Direct Message";
    activeIcon = <FiMessageSquare className="text-emerald-400" size={16} />;
  } else {
    const matchedChan = channelsList.find(c => c.id === activeChat);
    currentTitle = matchedChan ? matchedChan.name : "Workspace Room";
  }

  // ✏️ Handle Name Change Action Prompt
  const handleEditGroupName = () => {
    if (!isGroup || !currentGroupObj) return;
    const newName = prompt("Enter new name for this group:", currentGroupObj.name);
    if (newName && newName.trim() && newName.trim() !== currentGroupObj.name) {
      updateGroupName(currentGroupObj.id, newName.trim());
    }
  };

  return (
    <div className="h-14 w-full border-b border-slate-800/80 bg-[#0F172A] px-6 flex items-center justify-between relative z-40 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        {activeIcon}
        
        {/* Clickable editable title handle name text */}
        <span 
          onClick={isGroup ? handleEditGroupName : undefined}
          className={`text-sm font-bold text-slate-100 tracking-wide truncate ${isGroup ? "cursor-pointer hover:text-blue-400 flex items-center gap-1.5" : ""}`}
          title={isGroup ? "Click to rename group" : ""}
        >
          {currentTitle}
          {isGroup && <FiEdit2 size={11} className="text-slate-500 opacity-60 group-hover:opacity-100" />}
        </span>

        {isGroup && currentGroupObj && (
          <span className="text-[10px] bg-slate-900 text-slate-400 font-medium px-2 py-0.5 rounded-full border border-slate-800 shrink-0">
            {currentGroupObj.members.length} members
          </span>
        )}
      </div>

      {/* ⚙️ Group Admin Operations panel overlay view control */}
      {isGroup && currentGroupObj && (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 px-3 py-1.5 text-xs font-bold text-blue-400 transition"
          >
            <FiUsers size={13} />
            <span>Manage Settings</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2.5 z-50 space-y-3">
              
              {/* SECTION A: Add new members roster item picker dropdown */}
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-black px-1.5 tracking-wider mb-1">Invite Members</p>
                <div className="max-h-24 overflow-y-auto space-y-0.5">
                  {usersList.map((dev) => {
                    const alreadyInGroup = currentGroupObj.members.some(m => m.name === dev.name);
                    if (alreadyInGroup) return null;
                    return (
                      <button
                        key={dev.id}
                        onClick={() => addMemberToGroup(currentGroupObj.id, dev.name)}
                        className="w-full text-left px-2 py-1 rounded-md text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white flex items-center justify-between"
                      >
                        <span>+ {dev.name}</span>
                      </button>
                    );
                  })}
                  {usersList.every(dev => currentGroupObj.members.some(m => m.name === dev.name)) && (
                    <p className="text-[10px] text-slate-600 px-2 italic">All developers joined.</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800/80 my-1"></div>

              {/* SECTION B: Roster details list with Kick & Admin controls toggle */}
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-black px-1.5 tracking-wider mb-1">Group Roster</p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {currentGroupObj.members.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-900/40 border border-slate-900 text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-200 truncate font-semibold">{member.name}</span>
                        {member.isAdmin && <span className="text-[8px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1 rounded">Admin</span>}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Make Admin Action trigger badge */}
                        {!member.isAdmin && (
                          <button
                            onClick={() => makeGroupAdmin(currentGroupObj.id, member.name)}
                            className="p-1 text-slate-500 hover:text-amber-400 transition"
                            title="Make Admin"
                          >
                            <FiShield size={12} />
                          </button>
                        )}
                        {/* Remove From Group cross trigger */}
                        <button
                          onClick={() => removeMemberFromGroup(currentGroupObj.id, member.name)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Remove Member"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}