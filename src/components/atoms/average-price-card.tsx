import React, { useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard } from "lucide-react";
import useAveragePriceSocket from "@/hooks/sockets/useAveragePriceSocket";
import useBookTickerSocket from "@/hooks/sockets/useBookTickerSocket";
import useTradeSocket from "@/hooks/sockets/useTradeSocket";
import useBlinkEffect from "@/hooks/etc/useBlinkEffect";

const AveragePriceCard = ({ symbol }: any) => {
  const { message, error } = useAveragePriceSocket(symbol);

  // Use price as string because all the endpoints return strings (also no floating point shenanigans)
  const lastPrice = useRef("");
  const priceDivRef = useRef<HTMLDivElement>(null);

  useBlinkEffect(priceDivRef, lastPrice.current);

  // Prevent infinite loop
  const updatePrice = useCallback(() => {
    if (message?.w !== undefined && message.w !== lastPrice.current) {
      lastPrice.current = message.w;
    }
  }, [message?.w]);

  useEffect(() => {
    updatePrice();
  }, [message?.w, updatePrice]);

  useEffect(() => {
    const fetchData = async () => {
      lastPrice.current = "";
      try {
        const response = await fetch(`/api/avgPrice?sbl=${symbol}`);
        const data = await response.json();

        /**
         * Do a REST fetch to prevent the price from sitting on "Loading... "
         * until the socket connection is established and starts ticking
         */
        if (data.price) {
          lastPrice.current = data.price;
        }
      } catch (error: any) {
        console.warn(error);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current average price</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div ref={priceDivRef} className="text-2xl font-bold">
          {lastPrice.current ? `${parseFloat(lastPrice?.current).toFixed(6)}` : "Loading..."}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-constructive">+20.1%</span> from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default AveragePriceCard;
