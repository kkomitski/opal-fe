/**
 * Types for the Binance Websocket API
 */

export type Streams = "avgPrice" | "kline" | "bookTicker" | "trade" | "ticker";

export type AvgPriceResponseMessage = {
  e: "avgPrice"; // Event type
  E: number; // Event time (int64)
  s: string; // Symbol
  i: string; // Average price interval
  w: string; // Average price (actually float)
  T: EpochTimeStamp; // Last trade time (int64)
};

export type KlineResponseMessage = {
  e: "kline"; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: EpochTimeStamp; // Kline start time
    T: EpochTimeStamp; // Kline close time
    s: string; // Symbol
    i: Intervals; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // (float) Open price
    c: string; // (float) Close price
    h: string; // (float) High price
    l: string; // (float) Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
};

export type BookTickerResponseMessage = {
  u: number; // (int32) order book updateId
  s: string; // symbol
  b: string; // best bid price
  B: string; // best bid qty
  a: string; // best ask price
  A: string; // best ask qty
};

export type TradeResponseMessage = {
  e: "trade"; // Event type
  E: EpochTimeStamp; // Event time
  T: EpochTimeStamp; // Trade time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
};

export type TickerResponseMessage = {
  e: "24hrTicker"; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
};

export type Intervals =
  | "1s"
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";
