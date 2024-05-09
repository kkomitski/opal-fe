import { useEffect } from "react";

const aggTrade = {
  e: "aggTrade",
  E: 1715273490292,
  a: 566493395,
  s: "BNBUSDT",
  p: "592.410",
  q: "4.73",
  f: 1284549190,
  l: 1284549192,
  T: 1715273490140,
  m: false,
};

const markPrice = {
  e: "markPriceUpdate", // Event type
  E: 1562305380000, // Event time
  s: "BTCUSDT", // Symbol
  p: "11794.15000000", // Mark price
  i: "11784.62659091", // Index price
  P: "11784.25641265", // Estimated Settle Price, only useful in the last hour before the settlement starts
  r: "0.00038167", // Funding rate
  T: 1562306400000, // Next funding time
};

const trade = {
  e: "trade",
  E: 1715274097229,
  T: 1715274097228,
  s: "BTCUSDT",
  t: 4990759962,
  p: "61796.60",
  q: "0.052",
  X: "MARKET",
  m: false,
};

// BNB - binance coin
// BTC - bitcoin
// ETH - etherium
// LTC - litecoin

export default function WSS() {
  useEffect(() => {
    // const socket = new WebSocket("wss://fstream.binance.com:9443/ws/bnbbtc@trade");
    // const socket = new WebSocket("wss://fstream.binance.com/ws/bnbusdt@aggTrade");
    // const socket = new WebSocket("wss://fstream.binance.com/ws/btcusdt@markPrice");
    // const socket = new WebSocket("wss://fstream.binance.com/ws/btcusdt@trade"); // @1s - at 1 second
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/bnbbtc@trade"); // @1s - at 1 second

    socket.onopen = () => {
      console.log("WebSocket is connected");
    };

    socket.onmessage = (event) => {
      console.log("Received data from server:", event.data);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    setTimeout(() => {
      socket.close();
    }, 50000);
    // Clean up the connection when the component unmounts
    return () => socket.close();
  }, []); // Empty array means this effect runs once when the component mounts

  return <div>My App</div>;
}
