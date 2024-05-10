import CandleStickChart from "@/components/charts/candlestick";
import React, { useEffect, useState } from "react";
import originalData from "@/lib/aapl.json";
import bnbbtc from "@/lib/bnbbtc.json";

type Props = {};

const Candlestick = (props: Props) => {
  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, []); // Empty dependency array means this effect runs once on mount

  // Rest of your component...
};
export default Candlestick;
