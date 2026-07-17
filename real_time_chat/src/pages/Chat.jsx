import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { useChat } from "../context/ChatContext"; 
import { rooms } from "../data/rooms";

const usersList = [
  { id: "user-suraj", name: "Suraj" },
  { id: "user-rahul", name: "Rahul" },
  { id: "user-aman", name: "Aman" },
  { id: "user-priya", name: "Priya" },
];

export default function Chat() {
  // Saari states context se le rahe hain
  const { activeChat, setActiveChat, currentMessages, handleSendMessage } = useChat();

  // Dynamic Header details logic
  let activeDetails = { name: "General", subtitle: "12 Members • Online", isChannel: true };

  if (typeof activeChat === "number") {
    const currentRoom = rooms.find((r) => r.id === activeChat);
    if (currentRoom) {
      activeDetails = {
        name: `# ${currentRoom.name}`,
        subtitle: `${currentRoom.members} Members • Online`,
        isChannel: true
      };
    }
  } else if (typeof activeChat === "string" && activeChat.startsWith("user-")) {
    const currentUser = usersList.find((u) => u.id === activeChat);
    if (currentUser) {
      activeDetails = {
        name: currentUser.name,
        subtitle: "Online",
        isChannel: false
      };
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white">
      {/* 👈 Props dene ki zaroorat nahi hai ab */}
      <Sidebar /> 

      <div className="flex flex-1 flex-col h-full overflow-hidden min-w-0">
        <Header activeDetails={activeDetails} />
        <ChatWindow messages={currentMessages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}