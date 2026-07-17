import { io } from "socket.io-client";

export const socket = io("https://real-time-2crc.onrender.com", {
  autoConnect: false,
});
