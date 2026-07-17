import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export default function useSocket() {
  return useContext(ChatContext);
}