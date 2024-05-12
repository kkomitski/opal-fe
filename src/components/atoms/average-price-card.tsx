import React, { useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, CreditCard } from "lucide-react";
import useBlinkEffect from "@/hooks/etc/useBlinkEffect";
import useSocket from "@/hooks/sockets/useSocket";
import { AvgPriceResponseMessage } from "@/hooks/sockets/types";
import { Skeleton } from "../ui/skeleton";
import { formatFloat } from "@/lib/utils";

const AveragePriceCard = ({ avgPrice, priceChangePercent }: any) => {
  // const { message, error } = useSocket<AvgPriceResponseMessage>("avgPrice", symbol);

  // Use price as string because all the endpoints return strings (also no floating point shenanigans)
  const lastPrice = useRef("");
  const priceDivRef = useRef<HTMLDivElement>(null);

  useBlinkEffect(priceDivRef, lastPrice.current);

  // Prevent infinite loop
  const updatePrice = useCallback(() => {
    if (avgPrice !== undefined && avgPrice !== lastPrice.current) {
      lastPrice.current = avgPrice;
    }
  }, [avgPrice]);

  useEffect(() => {
    updatePrice();
  }, [avgPrice, updatePrice]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     lastPrice.current = "";
  //     try {
  //       const response = await fetch(`/api/avgPrice?symbol=${symbol}`);
  //       const data = await response.json();

  //       /**
  //        * Do a REST fetch to prevent the price from sitting on "Loading... "
  //        * until the socket connection is established and starts ticking
  //        */
  //       if (data.price) {
  //         lastPrice.current = data.price;
  //       }
  //     } catch (error: any) {
  //       console.warn(error);
  //     }
  //   };

  //   fetchData();
  // }, [symbol]);

  useEffect(() => {
    console.log(priceChangePercent);
  }, [priceChangePercent]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current average price</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div ref={priceDivRef} className="text-2xl font-bold">
          {lastPrice.current ? (
            formatFloat(lastPrice.current)
          ) : (
            <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className={`pr-1.5 ${priceChangePercent?.startsWith("-") ? "text-destructive" : "text-constructive"}`}>
            {priceChangePercent?.startsWith("-") ? `-${priceChangePercent}` : `+${priceChangePercent}`}
          </span>
          from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default AveragePriceCard;
