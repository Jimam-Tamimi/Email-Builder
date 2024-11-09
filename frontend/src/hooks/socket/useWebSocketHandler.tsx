"use client"

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWebSocket } from "@/context/WebSocketContext";

interface WebSocketData {
  type: string;
  [key: string]: any;
}

const useWebSocketHandler = (
  messageType: string,
  handleMessage: (data: WebSocketData) => void,
  runOnFocusOnly: boolean = false
) => {
  const { socket } = useWebSocket();
  const router = useRouter();
  
  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data: WebSocketData = JSON.parse(event.data);
      
      // Only handle messages of the specified type
      if (data.type === messageType) {
        if (runOnFocusOnly && !router.isReady) return; // Use router to ensure page focus
        handleMessage(data);
      }
    };

    socket.addEventListener("message", handleWebSocketMessage);

    return () => {
      socket.removeEventListener("message", handleWebSocketMessage);
    };
  }, [socket, messageType, handleMessage, runOnFocusOnly, router.isReady]);
};

export default useWebSocketHandler;
