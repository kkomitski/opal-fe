import { CreditCard, Activity, MessageCircleQuestionIcon, HandCoinsIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import SkeletonCard from "../atoms/skeleton-card";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import useSocket from "@/hooks/sockets/useSocket";
import { TickerResponseMessage } from "@/hooks/sockets/types";
import { Skeleton } from "../ui/skeleton";
import useBlinkEffect from "@/hooks/etc/useBlinkEffect";
import { formatFloat } from "@/lib/utils";

const InstrumentCardCollection = ({ symbol }: { symbol: string }) => {
  const { message, error } = useSocket<TickerResponseMessage>("ticker", symbol);

  const vals = useRef({ lastPrice: "", lastBestBid: "", lastBestAsk: "" });

  const totalTrades = message?.n;
  const symb = message?.s;

  // Average price
  const avgPrice = message?.w;
  const priceChangePercent = message?.P;

  const priceDivRef = useRef<HTMLDivElement>(null);
  const bestBidRef = useRef<HTMLDivElement>(null);
  const bestAskRef = useRef<HTMLDivElement>(null);

  // Best bid
  const bestBidPrice = message?.b;
  const bestBidQty = message?.B;

  // Best ask
  const bestAskPrice = message?.a;
  const bestAskQty = message?.A;

  useBlinkEffect(priceDivRef, vals.current.lastPrice);
  useBlinkEffect(bestBidRef, vals.current.lastBestBid);
  useBlinkEffect(bestAskRef, vals.current.lastBestAsk);

  // Prevent infinite loop
  const updateVals = useCallback(() => {
    if (avgPrice && avgPrice !== vals.current.lastPrice) {
      vals.current.lastPrice = avgPrice;
    }

    if (bestBidPrice && bestBidPrice !== vals.current.lastBestBid) {
      vals.current.lastBestBid = bestBidPrice;
    }

    if (bestAskPrice && bestAskPrice !== vals.current.lastBestAsk) {
      vals.current.lastBestAsk = bestAskPrice;
    }
  }, [avgPrice, bestBidPrice, bestAskPrice]);

  useEffect(() => {
    updateVals();
  }, [avgPrice, bestBidPrice, bestAskPrice, updateVals]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {/* Title Card */}
      {symbol ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symbol</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {symb ? symb : <Skeleton className="h-6 font-bold mt-1.5 w-48 rounded-[4px]" />}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalTrades ? `Total trades: ${totalTrades}` : <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />}
            </div>
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard />
      )}

      {/* Average Price Card */}
      {symbol ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Average Price</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div ref={priceDivRef} className="text-2xl font-bold">
              {vals.current.lastPrice ? (
                formatFloat(vals.current.lastPrice)
              ) : (
                <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />
              )}
            </div>
            {priceChangePercent ? (
              <div className="text-xs text-muted-foreground">
                <span
                  className={`pr-1.5 ${priceChangePercent?.startsWith("-") ? "text-destructive" : "text-constructive"}`}
                >
                  {priceChangePercent?.startsWith("-") ? `${priceChangePercent}%` : `+${priceChangePercent}%`}
                </span>
                from last month
              </div>
            ) : (
              <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />
            )}
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard />
      )}

      {/* Best Bid Card */}
      {symbol ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best bid</CardTitle>
            <HandCoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div ref={bestBidRef} className="text-2xl font-bold text-constructive">
              {bestBidPrice ? (
                formatFloat(bestBidPrice)
              ) : (
                <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px] max-w-[200px]" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {bestBidQty ? `Quantity: ${bestBidQty}` : <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />}
            </div>
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard />
      )}

      {/* Best Ask Card */}
      {symbol ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best ask</CardTitle>
            <MessageCircleQuestionIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div ref={bestAskRef} className="text-2xl font-bold text-destructive">
              {bestAskPrice ? formatFloat(bestAskPrice) : <Skeleton className="h-6 mb-2 w-28 w-26 rounded-[4px]" />}
            </div>
            <div className="text-xs text-muted-foreground">
              {bestAskQty ? `Quantity: ${bestAskQty}` : <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />}
            </div>
          </CardContent>
        </Card>
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

export default InstrumentCardCollection;
