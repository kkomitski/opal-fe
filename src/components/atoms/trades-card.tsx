import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import useSocket from "@/hooks/sockets/useSocket";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import trades from "@/pages/api/trades";
import { Link, Badge } from "lucide-react";
import { Button } from "../ui/button";
import { TradeResponseMessage } from "@/hooks/sockets/types";
import useBlinkEffect from "@/hooks/etc/useBlinkEffect";
import { formatFloat } from "@/lib/utils";

const TRADES_IN_MEMORY = 11;

const TradesCard = ({ symbol }: { symbol: string }) => {
  const { message, error } = useSocket<TradeResponseMessage>("trade", symbol);
  const [trades, setTrades] = useState<any>([]);

  const ref = useRef(null);

  const formatTimestamp = useCallback((timestamp: EpochTimeStamp) => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      try {
        const response = await fetch(`/api/trades?symbol=${symbol}&limit=${TRADES_IN_MEMORY}`);
        const data = await response.json();

        setTrades(data);
        /**
         * Do a REST fetch to prevent the price from sitting on "Loading... "
         * until the socket connection is established and starts ticking
         */
      } catch (error: any) {
        console.warn(error);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    if (message) {
      const newTrade = {
        id: message.t,
        price: message.p,
        time: message.T,
        qty: message.q,
      };
      setTrades((prevTrades: any) => {
        const newTrades = [newTrade, ...prevTrades];
        return newTrades.slice(0, TRADES_IN_MEMORY);
      });
    }
  }, [message]);

  // useBlinkEffect(ref, trades[0]);

  return (
    <Card className="col-span-2 xl:col-span-1">
      <CardHeader className="flex flex-row items-center pb-2">
        <div className="grid gap-2">
          <CardTitle>Market Trades</CardTitle>
          <CardDescription>Recent transactions from your store.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Customer</TableHead> */}
              <TableHead className="text-left">Price</TableHead>
              {/* <TableHead className="hidden xl:table-column">Status</TableHead> */}
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade: any, index: number) => {
              const price = parseFloat(trade.price);

              let isSell;

              if (price < trades[index + 1]?.price) {
                isSell = true;
              }

              return (
                <TableRow key={index} ref={index === 0 ? ref : null}>
                  <TableCell className="py-0">
                    {/* <div className="font-medium">Liam Johnson</div> */}
                    <p className={`"pr-0" ${isSell ? "text-destructive" : "text-constructive"}`}>
                      {formatFloat(trade.price)}
                    </p>
                  </TableCell>
                  <TableCell className="py-0">
                    <div className="font-medium text-right">{formatFloat(trade.qty)}</div>
                  </TableCell>
                  <TableCell className={`py-1 ${isSell ? "text-destructive" : "text-constructive"}`}>
                    <div className="text-right text-sm text-muted-foreground">{formatTimestamp(trade.time)}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TradesCard;
