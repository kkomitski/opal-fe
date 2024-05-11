import { useEffect, useState } from "react";

type Symbols = "bnbbtc";

// const websocketResponseMessage = {
//   e: "trade", // Event type
//   E: 1672515782136, // Event time
//   s: "BNBBTC", // Symbol
//   t: 12345, // Trade ID
//   p: "0.001", // Price
//   q: "100", // Quantity
//   b: 88, // Buyer order ID
//   a: 50, // Seller order ID
//   T: 1672515782136, // Trade time
//   m: true, // Is the buyer the market maker?
//   M: true, // Ignore
// };

type WebSocketResponseMessage = {
  e: "trade"; // Event type
  E: EpochTimeStamp; // Event time
  T: EpochTimeStamp; // Trade time
  s: Symbols; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
};

const useTradeSocket = (symbol: Symbols) => {
  const [message, setMessage] = useState<WebSocketResponseMessage | null>(null);
  const [error, setError] = useState<Event>();

  useEffect(() => {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

    socket.onopen = () => {
      console.log("WebSocket is connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
    setTimeout(() => {
      socket.close();
    }, 5000);
    return () => socket.close();
  }, [symbol]);

  console.log(message);

  return { message: message, error: error || null };
};

export default useTradeSocket;