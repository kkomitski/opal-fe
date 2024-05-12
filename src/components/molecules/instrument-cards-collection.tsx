import { symbol } from "d3";
import { CreditCard, Activity } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import AveragePriceCard from "../atoms/average-price-card";
import GenericCard from "../atoms/generic-card";
import SkeletonCard from "../atoms/skeleton-card";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import useSocket from "@/hooks/sockets/useSocket";
import { TickerResponseMessage } from "@/hooks/sockets/types";
import { Skeleton } from "../ui/skeleton";
import useBlinkEffect from "@/hooks/etc/useBlinkEffect";
import { formatFloat } from "@/lib/utils";

const InstrumentCardCollection = ({ symbol }: { symbol: string }) => {
  const { message, error } = useSocket<TickerResponseMessage>("ticker", symbol);

  const totalTrades = message?.n;
  const symb = message?.s;

  // Average price
  const avgPrice = message?.w;
  const priceChangePercent = message?.P;

  const lastPrice = useRef("");
  const priceDivRef = useRef<HTMLDivElement>(null);

  const lastBestBid = useRef("");
  const bestBidRef = useRef<HTMLDivElement>(null);

  const lastBestAsk = useRef("");
  const bestAskRef = useRef<HTMLDivElement>(null);

  // Best bid
  const bestBidPrice = message?.b;
  const bestBidQty = message?.B;

  // Best ask
  const bestAskPrice = message?.a;
  const bestAskQty = message?.A;

  useBlinkEffect(priceDivRef, lastPrice.current);
  useBlinkEffect(bestBidRef, lastBestBid.current);
  useBlinkEffect(bestAskRef, lastPrice.current);

  // Prevent infinite loop
  const updatePrice = useCallback(() => {
    if (avgPrice !== undefined && avgPrice !== lastPrice.current) {
      lastPrice.current = avgPrice;
    }
  }, [avgPrice]);

  const updateBestBid = useCallback(() => {
    if (bestBidPrice !== undefined && bestBidPrice !== lastBestBid.current) {
      lastBestBid.current = bestBidPrice;
    }
  }, [bestBidPrice]);

  const updateBestAsk = useCallback(() => {
    if (bestAskPrice !== undefined && bestAskPrice !== lastBestAsk.current) {
      lastBestAsk.current = bestAskPrice;
    }
  }, [bestAskPrice]);

  useEffect(() => {
    updatePrice();
  }, [bestAskPrice, updatePrice]);

  useEffect(() => {
    updatePrice();
  }, [avgPrice, updatePrice]);

  useEffect(() => {
    updateBestBid();
  }, [bestBidPrice, updateBestBid]);

  useEffect(() => {
    console.log(message);
  }, [message]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {/* Title Card */}
      {symbol ? (
        <GenericCard
          title="Symbol"
          heading={symbol}
          subheading={
            totalTrades ? `Total trades: ${totalTrades}` : <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />
          }
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
      ) : (
        <SkeletonCard />
      )}

      {/* Average Price Card */}
      {symbol ? (
        <GenericCard
          title="Current average price"
          heading={
            <div ref={priceDivRef} className="text-2xl font-bold">
              {lastPrice.current ? (
                formatFloat(lastPrice.current)
              ) : (
                <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />
              )}
            </div>
          }
          subheading={
            <p className="text-xs text-muted-foreground">
              <span
                className={`pr-1.5 ${priceChangePercent?.startsWith("-") ? "text-destructive" : "text-constructive"}`}
              >
                {priceChangePercent?.startsWith("-") ? `-${priceChangePercent}` : `+${priceChangePercent}`}
              </span>
              from last month
            </p>
          }
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
      ) : (
        <SkeletonCard />
      )}

      {/* Best Bid Card */}
      {symbol ? (
        <GenericCard
          title="Best bid"
          heading={
            <div ref={bestBidRef} className="text-2xl font-bold text-constructive">
              {bestBidPrice ? formatFloat(bestBidPrice) : <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />}
            </div>
          }
          subheading={<p className="text-xs text-muted-foreground">Quantity: {bestBidQty}</p>}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
      ) : (
        <SkeletonCard />
      )}

      {/* Best Ask Card */}
      {symbol ? (
        <GenericCard
          title="Best ask"
          heading={
            <div ref={bestAskRef} className="text-2xl font-bold text-destructive">
              {bestAskPrice ? formatFloat(bestAskPrice) : <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />}
            </div>
          }
          subheading={<p className="text-xs text-muted-foreground">Quantity: {bestAskQty}</p>}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

export default InstrumentCardCollection;
