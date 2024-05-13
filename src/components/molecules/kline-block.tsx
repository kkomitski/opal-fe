import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CandleStickChart from "@/components/charts/kline";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "../ui/slider";
import { KlineResponseMessage, Intervals } from "@/hooks/sockets/types";
import useSocket from "@/hooks/sockets/useSocket";
import KlineUtils from "../charts/kline.utils";
import { timeDay, timeMonth, timeYear } from "d3";
import { useRouter } from "next/router";

export type TimeFrames = "1D" | "5D" | "1M" | "3M" | "6M" | "1Y" | "5Y" | "All";

const CandlestickBlock = ({ title, chartProps, className, symbol, chartOptions }: any) => {
  const [defaultZoom, setdefaultZoom] = useState(5);
  const [data, setData] = useState();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrames>("6M");

  const candlestickBlockRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // const { message, error } = useSocket<KlineResponseMessage>("kline", symbol, { interval: "1s", timeout: 5000 });

  useEffect(() => {
    const searchParams = new URLSearchParams(router.asPath.substring(1));
    const timeframeParam = searchParams.get("tf");

    if (timeframeParam) {
      setSelectedTimeFrame(timeframeParam as TimeFrames);
    }
  }, [router?.asPath, symbol]);

  useEffect(() => {
    if (symbol) {
      const fetchData = async (selectedTimeFrame: TimeFrames, symbol: string) => {
        try {
          const endpoint = "/api/klines?";
          const base = window.location.origin;

          const url = new URL(base + endpoint);

          let limit = 0;
          let interval: Intervals = "1d";
          let startTime = 0;
          let endTime = 0;

          const now = new Date();

          const urlWithTimeFrame = new URL(window.location.href);

          // This line replaces the current URL without refreshing page
          // router.push(urlWithInstrument.pathname + urlWithInstrument.search, undefined, { shallow: true });

          switch (selectedTimeFrame) {
            case "All":
              interval = "1w";
              limit = 1000; // Max limit
              urlWithTimeFrame.searchParams.set("tf", "All");
              break;
            case "5Y":
              interval = "1w";
              startTime = timeYear.offset(now, -5).getTime(); // 5 Years
              urlWithTimeFrame.searchParams.set("tf", "5Y");
              break;
            case "1Y":
              interval = "1d";
              startTime = timeYear.offset(now, -12).getTime(); // 1 Year
              urlWithTimeFrame.searchParams.set("tf", "1Y");
              break;
            case "6M":
              interval = "1d";
              startTime = timeMonth.offset(now, -6).getTime();
              urlWithTimeFrame.searchParams.set("tf", "6M");
              break;
            case "3M":
              interval = "1d";
              startTime = timeMonth.offset(now, -3).getTime();
              urlWithTimeFrame.searchParams.set("tf", "3M");
              break;
            case "1M":
              interval = "6h";
              startTime = timeMonth.offset(now, -1).getTime();
              urlWithTimeFrame.searchParams.set("tf", "1M");
              break;
            case "5D":
              interval = "1h";
              startTime = timeDay.offset(now, -5).getTime();
              urlWithTimeFrame.searchParams.set("tf", "5D");
              break;
            case "1D": // TODO: Add another version of 1D for increased zoom level (ie zoom > 80 => interval = 1s)
              interval = "15m";
              startTime = timeDay.offset(timeDay.floor(now), -1).getTime();
              urlWithTimeFrame.searchParams.set("tf", "1D");
              break;
          }

          url.searchParams.set("symbol", symbol);
          url.searchParams.set("interval", interval);

          if (limit) url.searchParams.set("limit", limit.toString());
          if (startTime) url.searchParams.set("startTime", startTime.toString());
          if (endTime) url.searchParams.set("endTime", endTime.toString());

          const response = await fetch(url.href);
          const data = await response.json();

          if (!data.error) {
            setData(data);
            router.push(urlWithTimeFrame.pathname + urlWithTimeFrame.search, undefined, { shallow: true });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData(selectedTimeFrame, symbol);
    }
  }, [symbol, selectedTimeFrame]);

  // TODO: Finish implementing the kline live updates from the websocket for increased zoom levels
  // useEffect(() => {
  //   if (!restDataReady) return;
  //   if (message && data.length) {
  //     const newKline = new Array(11); // Prealloc memory block
  //     newKline[0] = message.k.t;
  //     newKline[1] = message.k.o;
  //     newKline[2] = message.k.h;
  //     newKline[3] = message.k.l;
  //     newKline[4] = message.k.c;

  //     const newArray = [...data, newKline];
  //     console.log(newArray);

  //     setData(newArray);
  //   }
  // }, [message]);

  return (
    <Card className={`${className} h-full`} ref={candlestickBlockRef}>
      <CardContent className="relative flex flex-col justify-end items-between h-full w-full">
        <CandleStickChart data={data} options={chartOptions} zoom={defaultZoom} selectedTimeFrame={selectedTimeFrame} />
        <Slider
          className="pt-5"
          defaultValue={[defaultZoom]}
          min={5}
          max={100}
          step={1}
          onValueChange={(v) => setdefaultZoom(v[0])}
        />
        <RadioGroup defaultValue="6M" onValueChange={(v: TimeFrames) => setSelectedTimeFrame(v)} className="flex pt-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="All" className="hidden" id="r1" />
            <Label htmlFor="r1" className={`cursor-pointer ${selectedTimeFrame === "All" && "text-primary"}`}>
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5Y" className="hidden" id="r2" />
            <Label htmlFor="r2" className={`cursor-pointer ${selectedTimeFrame === "5Y" && "text-primary"}`}>
              5Y
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1Y" className="hidden" id="r3" />
            <Label htmlFor="r3" className={`cursor-pointer ${selectedTimeFrame === "1Y" && "text-primary"}`}>
              1Y
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6M" className="hidden" id="r4" />
            <Label htmlFor="r4" className={`cursor-pointer ${selectedTimeFrame === "6M" && "text-primary"}`}>
              6M
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3M" className="hidden" id="r5" />
            <Label htmlFor="r5" className={`cursor-pointer ${selectedTimeFrame === "3M" && "text-primary"}`}>
              3M
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1M" className="hidden" id="r6" />
            <Label htmlFor="r6" className={`cursor-pointer ${selectedTimeFrame === "1M" && "text-primary"}`}>
              1M
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5D" className="hidden" id="r7" />
            <Label htmlFor="r7" className={`cursor-pointer ${selectedTimeFrame === "5D" && "text-primary"}`}>
              5D
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1D" className="hidden" id="r8" />
            <Label htmlFor="r8" className={`cursor-pointer ${selectedTimeFrame === "1D" && "text-primary"}`}>
              1D
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default CandlestickBlock;
