export default function RoomCard({ room, isActive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 transition ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${isActive ? "text-white" : "text-blue-400"} text-lg`}>
          #
        </div>

        <div>
          <p className="font-semibold">{room.name}</p>
          <p className={`text-xs ${isActive ? "text-blue-200" : "text-slate-400"}`}>
            {room.members} Members
          </p>
        </div>
      </div>

      {room.unread > 0 && !isActive && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
          {room.unread}
        </div>
      )}
    </div>
  );
}