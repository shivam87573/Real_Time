import { createContext, useState, useContext, useRef } from "react";

export const ChatContext = createContext();

export default function ChatProvider({ children }) {
  const [activeChat, setActiveChat] = useState("channel-general");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [msgCounter, setMsgCounter] = useState(0);

  // ⚡ TRAP ENGINE: Yeh ref check karega ki koi message background trigger se repeat na ho sake
  const lastProcessedMessageRef = useRef({ chatId: "", text: "", timestamp: 0 });
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("chat_user");
      return savedUser ? JSON.parse(savedUser) : { name: "suraj", avatar: "" };
    } catch (e) { return { name: "suraj", avatar: "" }; }
  });

  const [usersList, setUsersList] = useState([
    { id: "user-rahul", name: "Rahul", color: "bg-blue-500", isOnline: true },
    { id: "user-priya", name: "Priya", color: "bg-rose-500", isOnline: true },
    { id: "user-aman", name: "Aman", color: "bg-emerald-500", isOnline: false },
    { id: "user-neha", name: "Neha", color: "bg-purple-500", isOnline: true },
    { id: "user-kabir", name: "Kabir", color: "bg-amber-500", isOnline: false },
    { id: "user-aisha", name: "Aisha", color: "bg-pink-500", isOnline: true },
    { id: "user-dimple", name: "Dimple", color: "bg-fuchsia-500", isOnline: true },
    { id: "user-rohit", name: "Rohit", color: "bg-indigo-500", isOnline: true },
    { id: "user-ananya", name: "Ananya", color: "bg-teal-500", isOnline: true },
    { id: "user-sameer", name: "Sameer", color: "bg-cyan-500", isOnline: false },
    { id: "user-tanvi", name: "Tanvi", color: "bg-violet-500", isOnline: true },
    { id: "user-vikram", name: "Vikram", color: "bg-orange-500", isOnline: true },
    { id: "user-ritika", name: "Ritika", color: "bg-lime-500", isOnline: true },
    { id: "user-arjun", name: "Arjun", color: "bg-sky-500", isOnline: false },
    { id: "user-divya", name: "Divya", color: "bg-red-500", isOnline: true },
    { id: "user-kartik", name: "Kartik", color: "bg-yellow-500", isOnline: true }
  ]);

  const [groupsList, setGroupsList] = useState([
    { 
      id: "group-devs", 
      name: "Core Developers", 
      members: [
        { name: "suraj", isAdmin: true },
        { name: "Rahul", isAdmin: false }, 
        { name: "Priya", isAdmin: true },
        { name: "Dimple", isAdmin: false },
        { name: "Kabir", isAdmin: false },
        { name: "Aisha", isAdmin: false }
      ] 
    }
  ]);

  const [channelsList] = useState([
    { id: "channel-general", name: "General Workspace" }
  ]);

  const [chatMessages, setChatMessages] = useState({
    "channel-general": [{ id: 1, own: false, username: "Rahul", message: "Welcome to Workspace! 👋", time: "10:20 PM" }]
  });

  const login = (username) => {
    const newUser = { name: username, avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${username}` };
    setUser(newUser);
    localStorage.setItem("chat_user", JSON.stringify(newUser));
  };

  const logout = () => { setUser(null); localStorage.removeItem("chat_user"); };

  const createNewGroup = (groupName) => {
    if (!groupName.trim()) return;
    const gId = `group-${Date.now()}`;
    const newGroupObj = { 
      id: gId, 
      name: groupName.trim(), 
      members: [{ name: user?.name || "suraj", isAdmin: true }] 
    };
    setGroupsList(prev => [...prev, newGroupObj]);
    setActiveChat(gId);
  };

  const addMultipleMembersToGroup = (groupId, memberNamesArray) => {
    if (!memberNamesArray || memberNamesArray.length === 0) return;
    setGroupsList(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const freshMembers = memberNamesArray
            .filter(name => !group.members.some(m => m.name === name))
            .map(name => ({ name, isAdmin: false }));
          if (freshMembers.length === 0) return group;
          sendSystemMessage(groupId, `Added members: ${memberNamesArray.join(", ")}`);
          return { ...group, members: [...group.members, ...freshMembers] };
        }
        return group;
      })
    );
  };

  const updateGroupName = (groupId, newName) => {
    if (!newName.trim() || !user) return false;
    let isUpdated = false;
    setGroupsList(prev => prev.map(g => {
      if (g.id === groupId) {
        const actingMember = g.members.find(m => m.name === user.name);
        if (actingMember && actingMember.isAdmin) {
          isUpdated = true;
          return { ...g, name: newName.trim() };
        }
      }
      return g;
    }));
    if (isUpdated) {
      sendSystemMessage(groupId, `Group renamed to "${newName.trim()}"`);
      return true;
    } else {
      alert("Permission Denied: Sirf Group Admins hi name badal sakte hain!");
      return false;
    }
  };

  const toggleAdminStatus = (groupId, targetMemberName) => {
    if (!user) return;
    setGroupsList(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const currentUserPermissions = group.members.find(m => m.name === user.name);
          if (!currentUserPermissions || !currentUserPermissions.isAdmin) {
            alert("Action Denied: Sirf ek core admin hi roles manage kar sakta hai!");
            return group;
          }
          const updatedMembers = group.members.map(member => {
            if (member.name === targetMemberName) {
              const nextAdminState = !member.isAdmin;
              sendSystemMessage(groupId, `${targetMemberName} is now ${nextAdminState ? "an Admin" : "a Regular Member"}`);
              return { ...member, isAdmin: nextAdminState };
            }
            return member;
          });
          return { ...group, members: updatedMembers };
        }
        return group;
      })
    );
  };

  const leaveGroup = (groupId) => {
    if (!user) return;
    setGroupsList(prev => {
      const targeted = prev.find(g => g.id === groupId);
      if (!targeted) return prev;
      const filterOut = targeted.members.filter(m => m.name !== user.name);
      if (filterOut.length === 0) return prev.filter(g => g.id !== groupId);
      if (!filterOut.some(m => m.isAdmin)) filterOut[0].isAdmin = true;
      return prev.map(g => g.id === groupId ? { ...g, members: filterOut } : g);
    });
    sendSystemMessage(groupId, `${user.name} left the group channel.`);
    setActiveChat("channel-general");
  };

  const removeMemberFromGroup = (groupId, memberName) => {
    setGroupsList(prev => prev.map(g => g.id === groupId ? { ...g, members: g.members.filter(m => m.name !== memberName) } : g));
    sendSystemMessage(groupId, `${memberName} was removed.`);
  };

  const sendSystemMessage = (groupId, text) => {
    const notice = {
      id: Date.now() + Math.random(),
      own: false,
      username: "System",
      message: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => ({ ...prev, [groupId]: [...(prev[groupId] || []), notice] }));
  };

  const deleteMessage = (msgId) => {
    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: prev[activeChat].filter((msg) => msg.id !== msgId),
    }));
  };

  // 🗣️ MULTI-PERSPECTIVE CONVERSATIONAL ENGINE
  const getPersonalizedResponse = (senderName, userMessage, responderIndex) => {
    const text = userMessage.trim();
    const lowerText = text.toLowerCase();

    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const foundEmojis = text.match(emojiRegex);

    if (foundEmojis && foundEmojis.length > 0) {
      const userEmoji = foundEmojis[0];
      const emojiOptions = [
        `Got it! Let's hit the target on this build. ${userEmoji} 🚀`,
        `Perfect! Absolutely aligned with these targets. ${userEmoji} ✨`,
        `Awesome! Love the vibe here, let's execute. ${userEmoji} 🎉`,
        `Nice! Tracking perfectly on my dashboard. ${userEmoji} 💯`,
        `Sounds like a plan, count me in! ${userEmoji} 👍`
      ];
      return emojiOptions[(responderIndex + senderName.charCodeAt(0)) % emojiOptions.length];
    }

    if (lowerText.includes("hey") || lowerText.includes("hi") || lowerText.includes("hello")) {
      const helloPool = [
        `Hey! Just wrapping up a quick local test run. What's the update?`,
        `Hello! Glad you reached out. How are tasks tracking for the day?`,
        `Hey! How's everything going? Ready to share the latest status?`,
        `Hi there! Just got into the workspace. Let me know if you need anything.`,
        `Hello! Good to connect in this room. Let's align.`
      ];
      return helloPool[(responderIndex + senderName.charCodeAt(0)) % helloPool.length];
    }

    if (lowerText.includes("great") || lowerText.includes("work") || lowerText.includes("done") || lowerText.includes("fixed") || lowerText.includes("good")) {
      const workPool = [
        `Brilliant. Thanks for committing these changes so fast. 🚀`,
        `Perfect. This keeps our schedule exactly aligned with the launch timeline. 👍`,
        `Awesome work! That looks incredibly solid. Let's push it forward. 💯`,
        `Super clean! This resolves the baseline layout constraints nicely. 🔥`,
        `Fantastic update! Thanks for keeping the team loops updated. 🤝`
      ];
      return workPool[(responderIndex + senderName.charCodeAt(0)) % workPool.length];
    }

    if (lowerText.includes("how are you")) {
      const statusPool = [
        `Doing great, sorting out the local dev branch repository build.`,
        `All good here, finalizing the milestone reports for our alignment call.`,
        `I'm doing great! Just keeping track of our current design assets.`,
        `Everything is operational on my end. Ready when you are.`
      ];
      return statusPool[(responderIndex + senderName.charCodeAt(0)) % statusPool.length];
    }

    const generalPool = [
      `Makes sense. Let's trace the log schemas to ensure everything handles gracefully.`,
      `Got it. I'll clone your latest branch commits to check it locally in a bit.`,
      `Understood. Let's make sure we document this change under our sprint logs.`,
      `Sounds like a plan. I'll add this context to tomorrow morning's scrum agenda.`,
      `Got it! I will review the component bounds inside Figma to keep them consistent.`,
      `Thanks for sharing the update here in the workspace team feed.`
    ];

    return generalPool[(responderIndex + senderName.charCodeAt(0)) % generalPool.length];
  };

  const handleSendMessage = (text) => {
    if (!text || !text.trim() || !user) return;
    
    const currentActive = activeChat;
    const currentText = text.trim();
    const now = Date.now();

    // ⚡ CRITICAL REPEAT SHIELD GUARD: 
    // Agar same chat mein, same text, pichle 1 second (1000ms) ke andar dobara trigger ho, toh abort kar do!
    if (
      lastProcessedMessageRef.current.chatId === currentActive &&
      lastProcessedMessageRef.current.text === currentText &&
      now - lastProcessedMessageRef.current.timestamp < 1000
    ) {
      return; 
    }

    // Ref ko instantly unique values se override karo
    lastProcessedMessageRef.current = {
      chatId: currentActive,
      text: currentText,
      timestamp: now
    };

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { id: now, own: true, username: user.name, message: currentText, time: userTime };
    
    setChatMessages(prev => ({ ...prev, [currentActive]: [...(prev[currentActive] || []), msg] }));
    setMsgCounter(prev => prev + 1);

    // IF ACTIVE CHAT IS A SINGLE DM CHAT
    if (currentActive.startsWith("user-")) {
      const matchedUser = usersList.find(u => u.id === currentActive);
      const targetName = matchedUser ? matchedUser.name : "Rahul";

      setTimeout(() => { 
        setTypingUser(targetName); 
        setIsTyping(true); 
      }, 400);
      
      setTimeout(() => {
        setIsTyping(false);
        const dmReply = {
          id: Date.now() + 500,
          own: false,
          username: targetName,
          message: getPersonalizedResponse(targetName, currentText, msgCounter + targetName.charCodeAt(0)),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => ({ ...prev, [currentActive]: [...(prev[currentActive] || []), dmReply] }));
      }, 1300);

    // IF ACTIVE CHAT IS A GROUP CHAT
    } else if (currentActive.startsWith("group-")) {
      const currentGroup = groupsList.find(g => g.id === currentActive);
      if (!currentGroup) return;
      
      const membersToRespond = currentGroup.members.filter(m => m.name !== user.name).map(m => m.name);

      membersToRespond.forEach((memberName, index) => {
        setTimeout(() => { 
          setTypingUser(memberName); 
          setIsTyping(true); 
        }, 500 + index * 1600);
        
        setTimeout(() => {
          setIsTyping(false);
          const groupReply = {
            id: Date.now() + index + 200,
            own: false,
            username: memberName,
            message: getPersonalizedResponse(memberName, currentText, index + msgCounter + 5),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setChatMessages(prev => ({ ...prev, [currentActive]: [...(prev[currentActive] || []), groupReply] }));
        }, 1800 + index * 1600);
      });
    }
  };

  return (
    <ChatContext.Provider value={{
      activeChat, setActiveChat, chatMessages, currentMessages: chatMessages[activeChat] || [],
      user, login, logout, isTyping, typingUser, usersList, groupsList, channelsList,
      createNewGroup, addMultipleMembersToGroup, updateGroupName, toggleAdminStatus, leaveGroup, removeMemberFromGroup,
      handleSendMessage,
      addMemberToGroup: (groupId, memberName) => addMultipleMembersToGroup(groupId, [memberName]), 
      deleteMessage,
      quickReplies: [
        "Hello! 👋", 
        "How are you? 😊", 
        "Great work! 🚀", 
        "Sounds good! 👍", 
        "Thanks for the update. 🤝", 
        "Let's review this. 🎯", 
        "I am completely aligned. 💯", 
        "Looks good to me! 🔥", 
        "On it right now. 😎", 
        "Let's schedule a huddle. 🙌"
      ]
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() { return useContext(ChatContext); }