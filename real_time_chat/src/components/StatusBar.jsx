import useSocket from "../hooks/useSocket";

export default function StatusBar() {
  const { connected } = useSocket();

  return (
    <div className="border-t border-slate-800 p-5">
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            connected ? "bg-green-500" : "bg-red-500"
          }`}
        />

        <span className="font-medium">
          {connected ? "Connected" : "Offline"}
        </span>
      </div>
    </div>
  );
}