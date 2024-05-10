import { useEffect, useState } from "react";

type Symbols = "bnbbtc";

// const websocketResponseMessage = {
//   u: 400900217, // order book updateId
//   s: "BNBUSDT", // symbol
//   b: "25.35190000", // best bid price
//   B: "31.21000000", // best bid qty
//   a: "25.36520000", // best ask price
//   A: "40.66000000", // best ask qty
// };

type WebSocketResponseMessage = {
  u: number; // order book updateId
  s: Symbols; // symbol
  b: string; // best bid price
  B: string; // best bid qty
  a: string; // best ask price
  A: string; // best ask qty
};

const useBookTickerSocket = (symbol: Symbols) => {
  const [message, setMessage] = useState<WebSocketResponseMessage | null>(null);
  const [error, setError] = useState<Event>();

  useEffect(() => {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@bookTicker`); // @1s - at 1 second

    socket.onopen = () => {
      console.log("WebSocket is connected");
    };

    socket.onmessage = (event) => {
      // console.log("Received data from server:", event.data);
      setMessage(event.data);
    };

    socket.onerror = (errorEvent) => {
      console.log("WebSocket error:", errorEvent);
      setError(errorEvent);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    // Close the socket after 10 seconds
    setTimeout(() => {
      socket.close();
    }, 30000);
    return () => socket.close();
  }, [symbol]);

  // If message or error
  return { message: message || null, error: error || null };
};

export default useBookTickerSocket;
