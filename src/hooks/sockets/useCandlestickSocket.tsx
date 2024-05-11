import { Symbols } from "@/types/symbols";
import { useEffect, useState } from "react";

type WebSocketResponseMessage = {
  e: string; // Event type
  E: number; // Event time (int64)
  s: string; // Symbol
  i: string; // Average price interval
  w: string; // Average price (actually float)
  T: EpochTimeStamp; // Last trade time (int64)
};

const useCandlestickSocket = (symbol: string, interval = "1s") => {
  const [message, setMessage] = useState<WebSocketResponseMessage | null>(null);
  const [error, setError] = useState<Event>();

  useEffect(() => {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);

    socket.onopen = () => {
      console.log("WebSocket is connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setMessage(data);
    };

    socket.onerror = (errorEvent) => {
      console.log("WebSocket error:", errorEvent);
      setError(errorEvent);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    // Close the socket after 30 seconds
    // setTimeout(() => {
    //   socket.close();
    // }, 30000);
    return () => socket.close();
  }, [symbol]);

  // If message or error
  return { message: message || null, error: error || null };
};

export default useCandlestickSocket;
