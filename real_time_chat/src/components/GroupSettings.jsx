import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

export default function GroupSettings() {
  const { activeChat, groupsList, usersList, user, updateGroupName, addMultipleMembersToGroup, toggleAdminStatus, leaveGroup, removeMemberFromGroup } = useChat();
  
  const [newTitle, setNewTitle] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  if (!activeChat || !activeChat.startsWith("group-")) {
    return <div className="p-4 text-gray-400 text-center text-sm">Active group select kijiye panel check karne ke liye.</div>;
  }

  const currentGroup = groupsList.find((g) => g.id === activeChat);
  if (!currentGroup) return <div className="p-4 text-red-400 text-center">Group unavailable.</div>;

  // Kya current system browser user is group ka admin hai?
  const amIAdmin = currentGroup.members.find((m) => m.name === user?.name)?.isAdmin;

  const handleCheckboxToggle = (name) => {
    setSelectedContacts(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="p-5 text-gray-200 bg-slate-900 rounded-xl border border-slate-800 space-y-6 shadow-2xl">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          ⚙️ {currentGroup.name}
        </h2>
        <span className="text-xs text-gray-400 px-2 py-0.5 bg-slate-800 rounded-md mt-1 inline-block">
          {amIAdmin ? "👑 Dashboard Owner Access" : "🔒 Member View Only"}
        </span>
      </div>

      {/* RENAME SECTION */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-400">Group Name Management</label>
        <div className="flex gap-2">
          <input
            type="text"
            disabled={!amIAdmin}
            placeholder={amIAdmin ? "Enter target custom name..." : "Locked: Admins only"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm bg-slate-950 border border-slate-700 rounded-lg outline-none focus:border-blue-500 disabled:opacity-40"
          />
          <button
            onClick={() => { updateGroupName(currentGroup.id, newTitle); setNewTitle(""); }}
            disabled={!amIAdmin || !newTitle.trim()}
            className="px-4 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-slate-800 transition-all"
          >
            Save
          </button>
        </div>
      </div>

      {/* ROSTER MANAGEMENT: DEMOTE/PROMOTE ADMINS */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-400">Current Members & Roles Control</label>
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 divide-y divide-slate-800 max-h-48 overflow-y-auto">
          {currentGroup.members.map((member) => (
            <div key={member.name} className="flex items-center justify-between py-2 px-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">{member.name}</span>
                {member.isAdmin && <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">Admin</span>}
              </div>
              
              {/* Actions visible to group admin only, and cannot manage their own self role */}
              {amIAdmin && member.name !== user?.name && (
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAdminStatus(currentGroup.id, member.name)}
                    className={`text-xs px-2.5 py-1 font-semibold rounded transition-all ${
                      member.isAdmin 
                        ? "bg-orange-600/20 text-orange-400 border border-orange-500/30 hover:bg-orange-600 hover:text-white" 
                        : "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {member.isAdmin ? "Remove Admin Role" : "Make Admin"}
                  </button>
                  <button 
                    onClick={() => removeMemberFromGroup(currentGroup.id, member.name)}
                    className="text-xs px-2 py-1 bg-rose-600/20 text-rose-400 border border-rose-600/30 hover:bg-rose-600 hover:text-white rounded"
                  >
                    Kick
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BULK MULTI-SELECT ADDS */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-400">Add Available Contacts</label>
        <div className="max-h-36 overflow-y-auto bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-2">
          {usersList
            .filter((u) => !currentGroup.members.some((m) => m.name === u.name))
            .map((contact) => (
              <label key={contact.id} className="flex items-center gap-2.5 p-1 hover:bg-slate-900 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.name)}
                  onChange={() => handleCheckboxToggle(contact.name)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <span className="text-sm text-slate-300">{contact.name}</span>
              </label>
            ))}
          {usersList.filter((u) => !currentGroup.members.some((m) => m.name === u.name)).length === 0 && (
            <p className="text-xs text-center text-slate-500 py-3">All contacts are in this channel.</p>
          )}
        </div>
        <button
          onClick={() => { addMultipleMembersToGroup(currentGroup.id, selectedContacts); setSelectedContacts([]); }}
          disabled={selectedContacts.length === 0}
          className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-all"
        >
          Add Selected ({selectedContacts.length})
        </button>
      </div>

      {/* LEAVE GROUP BUTTON */}
      <div className="pt-2 border-t border-slate-800">
        <button
          onClick={() => { if(window.confirm("Leave group?")) leaveGroup(currentGroup.id); }}
          className="w-full py-2 bg-rose-600 text-white font-bold text-sm rounded-lg hover:bg-rose-700 transition-all shadow-md"
        >
          🚪 Leave This Group Channel
        </button>
      </div>
    </div>
  );
}