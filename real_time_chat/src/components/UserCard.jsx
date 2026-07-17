export default function UserCard({ user, isActive, onClick }) {
  return (
    <div
      onClick={onClick} // 👈 Yeh sabse zaroori hai! Is click event ke bina click kaam nahi karega.
      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${
        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
      }`}
    >
      <div className="relative">
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
          alt={user.name}
          className="h-10 w-10 rounded-full"
        />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500"></span>
      </div>

      <div className="flex-1">
        <p className="font-semibold">{user.name}</p>
        <p className={`text-xs ${isActive ? "text-blue-200" : "text-slate-400"}`}>Online</p>
      </div>

      {user.unread > 0 && !isActive && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {user.unread}
        </span>
      )}
    </div>
  );
}