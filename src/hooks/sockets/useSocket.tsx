import { useEffect, useRef, useState } from "react";
import { Intervals, Streams } from "./types";

/**
 * Hook to connect to a socket
 *
 * @param stream The stream to connect to
 * @param symbol Symbol to get data for
 * @param interval Select sockets that require an interval
 * @param timeout (ms) After how long to time out the socket
 *
 * @returns The message and error from the socket as object
 */
function useSocket<T>(
  stream: Streams,
  symbol: string,
  opts: {
    interval?: Intervals;
    timeout?: number;
  } = {}
): { message: T | null; error: Event | null } {
  // TODO: Implement heartbeat (ping at every 3 minutes, pong must contain ping value)
  // [https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-api.md#general-api-information]

  // Create a a ref to maintain socket state across renders
  const webSocket = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState<T | null>(null);
  const [error, setError] = useState<Event>();

  useEffect(() => {
    const socketEndpoint = `wss://stream.binance.com:9443/ws/`;

    const sanitizedSymbol = symbol.toLowerCase();

    let socketUrl = "";

    // AveragePrice
    if (stream === "avgPrice") {
      socketUrl = socketEndpoint + `${sanitizedSymbol}@avgPrice`;
    }

    // Kline
    if (stream === "kline") {
      if (!opts?.interval) throw new Error("Interval is required for kline stream");

      socketUrl = socketEndpoint + `${sanitizedSymbol}@kline_${opts?.interval}`;
    }

    // Book Ticker
    if (stream === "bookTicker") {
      socketUrl = socketEndpoint + `${sanitizedSymbol}@bookTicker`;
    }

    // Trade
    if (stream === "trade") {
      socketUrl = socketEndpoint + `${sanitizedSymbol}@trade`;
    }

    // Ticker
    if (stream === "ticker") {
      socketUrl = socketEndpoint + `${sanitizedSymbol}@ticker`;
    }

    console.log(socketUrl);

    webSocket.current = new WebSocket(socketUrl);

    webSocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data);
      setMessage(data);
    };
    webSocket.current.onerror = (errorEvent) => {
      console.log("WebSocket error:", errorEvent);
      setError(errorEvent);
    };

    // Close the socket after a timeout
    if (opts?.timeout) {
      setTimeout(() => {
        if (webSocket.current?.readyState === WebSocket.OPEN) webSocket.current?.close();
        console.log(`WebSocket to ${stream} closed via timeout after ${opts.timeout}ms`);
      }, opts?.timeout);
    }

    // Cleanup
    return () => {
      if (webSocket.current?.readyState === WebSocket.OPEN) {
        console.log("Closing socket" + stream);
        webSocket.current?.close();
      }
    };
  }, [symbol, opts?.interval, stream, opts?.timeout]);

  // If message or error
  return { message: message || null, error: error || null };
}

export default useSocket;
// import { useEffect, useRef, useState } from "react";
// import { Intervals, Streams } from "./types";

// /**
//  * Hook to connect to a socket
//  *
//  * @param stream The stream to connect to
//  * @param symbol Symbol to get data for
//  * @param interval Select sockets that require an interval
//  * @param timeout (ms) After how long to time out the socket
//  *
//  * @returns The message and error from the socket as object
//  */
// function useSocket<T>(
//   stream: Streams,
//   symbol: string,
//   opts: {
//     interval?: Intervals;
//     timeout?: number;
//   } = {}
// ): { message: T | null; error: Event | null } {
//   // Create a a ref to maintain socket state across renders
//   const webSocket = useRef<WebSocket | null>(null);

//   const [message, setMessage] = useState<T | null>(null);
//   const [error, setError] = useState<Event>();

//   useEffect(() => {
//     const currentWebSocket = webSocket.current;

//     const socketEndpoint = `wss://stream.binance.com:9443/ws/`;

//     const sanitizedSymbol = symbol.toLowerCase();

//     let socketUrl = "";

//     // AveragePrice
//     if (stream === "avgPrice") {
//       socketUrl = socketEndpoint + `${sanitizedSymbol}@avgPrice`;
//     }

//     // Kline
//     if (stream === "kline") {
//       if (!opts?.interval) throw new Error("Interval is required for kline stream");

//       socketUrl = socketEndpoint + `${sanitizedSymbol}@kline_${opts?.interval}`;
//     }

//     // Book Ticker
//     if (stream === "bookTicker") {
//       socketUrl = socketEndpoint + `${sanitizedSymbol}@bookTicker`;
//     }

//     // Trade
//     if (stream === "trade") {
//       socketUrl = socketEndpoint + `${sanitizedSymbol}@trade`;
//     }

//     // Set up the socket
//     if (!webSocket.current || webSocket.current.readyState === WebSocket.CLOSED) {
//       const socket = new WebSocket(socketUrl);
//       webSocket.current = socket;
//       if (webSocket.current)
//         socket.onopen = () => {
//           console.log(`WebSocket to ${stream} is connected`);
//         };

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log(data);
//         setMessage(data);
//       };

//       socket.onerror = (errorEvent) => {
//         console.log("WebSocket error:", errorEvent);
//         setError(errorEvent);
//       };

//       socket.onclose = () => {
//         console.warn("WebSocket connection closed");
//       };

//       // Close the socket after a timeout
//       if (opts?.timeout) {
//         setTimeout(() => {
//           socket?.close();
//           console.log(`WebSocket to ${stream} closed via timeout after ${opts.timeout}ms`);
//         }, opts?.timeout);
//       }
//     }

//     return () => {
//       if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
//         console.log("Closing socket" + currentWebSocket);
//         console.log("For " + stream);
//         currentWebSocket.close();
//       }
//     };
//   }, [symbol, opts?.interval, stream, opts?.timeout]);

//   // If message or error
//   return { message: message || null, error: error || null };
// }

// export default useSocket;
