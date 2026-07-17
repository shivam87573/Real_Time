export default function Message({
  own,
  username,
  message,
  time,
}) {
  return (
    <div
      className={`flex mb-5 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      {!own && (
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
          alt={username}
          className="w-10 h-10 rounded-full mr-3"
        />
      )}

      <div
        className={`max-w-md rounded-2xl px-4 py-3 shadow-lg ${
          own
            ? "bg-blue-600 rounded-br-md"
            : "bg-slate-700 rounded-bl-md"
        }`}
      >
        {!own && (
          <p className="text-blue-400 font-semibold mb-1">
            {username}
          </p>
        )}

        <p>{message}</p>

        <div className="mt-2 flex justify-end gap-2 text-xs text-slate-300">
          <span>{time}</span>

          {own && <span>✓✓</span>}
        </div>
      </div>
    </div>
  );
}