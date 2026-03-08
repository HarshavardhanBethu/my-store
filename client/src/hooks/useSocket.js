import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "https://harsha-store.onrender.com";

const socket = io(SERVER_URL, {
  transports: ["websocket"], 
  upgrade: false
});

export function useSocket() {

  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [liveOrders, setLiveOrders] = useState(0);

  useEffect(() => {

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("live_stats", ({ onlineUsers, liveOrders }) => {
      setOnlineUsers(onlineUsers);
      setLiveOrders(liveOrders);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("live_stats");
    };

  }, []);

  return {
    connected,
    onlineUsers,
    liveOrders
  };
}
