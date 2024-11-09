"use client"
import { RootState } from "@/redux/store";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";

interface WebSocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const auth = useSelector(
    (state: RootState) => state.auth.data)

  useEffect(() => {
    if (auth?.user?.id && auth?.access) {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${auth?.user?.id}/`); // Replace with your WebSocket URL

      setSocket(ws);
      return () => {
        ws.close();
      };
    }  
    return () => {};
  }, [auth]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
