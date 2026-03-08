import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_API_URL || "https://harsha-store.onrender.com";

const socket = io(SERVER_URL, {
  transports: ["websocket"],
  reconnection: true
});

export function useSocket() {

  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [liveOrders, setLiveOrders] = useState(0);

  useEffect(() => {

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected:", SERVER_URL);
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

  const calculatePrice = (data, onProgress, onResult) => {

    socket.emit("calculate_price", data);

    socket.on("price_progress", (progress) => {
      if (onProgress) onProgress(progress);
    });

    socket.once("price_result", (result) => {
      if (onResult) onResult(result);
    });

  };

  const subscribeOrderUpdates = (orderId, callback) => {

    const eventName = `order_update_${orderId}`;
    socket.on(eventName, callback);

    return () => socket.off(eventName, callback);

  };

  return {
    connected,
    onlineUsers,
    liveOrders,
    calculatePrice,
    subscribeOrderUpdates
  };
}
