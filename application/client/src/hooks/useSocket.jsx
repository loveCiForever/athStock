import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const [marketData, setMarketData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("[Socket.IO Client] Connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("[Socket.IO Client] Connection error:", error);
      setIsConnected(false);
    });

    socketRef.current.on("stockData", (content) => {
      console.log("[Socket.IO Client] Raw data received:", content);

      try {
        const parsedContent =
          typeof content === "string" ? JSON.parse(content) : content;
        setMarketData(parsedContent);
      } catch (err) {
        console.error("[Socket.IO Client] Failed to parse stockData:", err);
        setMarketData(content);
      }
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("[Socket.IO Client] Disconnected:", reason);
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const switchChannel = (channelName) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("[Socket.IO Client] Switching to channel:", channelName);
      socketRef.current.emit("switchChannel", channelName);
    } else {
      console.warn("[Socket.IO Client] Cannot switch channel - not connected");
    }
  };
  return { marketData, switchChannel, isConnected };
}
