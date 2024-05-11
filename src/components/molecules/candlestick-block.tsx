import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CandleStickChart from "../charts/candlestick";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Slider } from "../ui/slider";
import useCandlestickSocket from "@/hooks/sockets/useCandlestickSocket";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {};

function monthsAgoToEpoch(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.getTime();
}

function daysAgoToEpoch(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.getTime();
}

const CandlestickBlock = ({ title, chartProps, className, symbol, chartOptions }: any) => {
  // const { message, error } = useCandlestickSocket(symbol);
  const candlestickBlockRef = useRef<HTMLDivElement>(null);

  const [defaultZoom, setdefaultZoom] = useState(5);
  const [data, setData] = useState();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("5Y");

  // useEffect(() => {
  //   console.log(selectedTimeFrame);
  //   window.addEventListener("resize", () => {
  //     extendedChartProps.options.width = candlestickBlockRef?.current?.offsetWidth;
  //   });
  //   // console.log(candlestickBlockRef.current.offsetWidth);
  // }, [selectedTimeFrame]);

  useEffect(() => {
    if (symbol) {
      async function fetchData(selectedTimeFrame: string, symbol: string) {
        try {
          const endpoint = "/api/klines?";
          const base = window.location.origin;

          const url = new URL(base + endpoint);

          let limit = 0;
          let interval = "1d";
          let startTime = 0;
          switch (selectedTimeFrame) {
            case "All":
              interval = "1w";
              startTime = monthsAgoToEpoch(200); // 5 Years
              break;
            case "5Y":
              interval = "1w";
              limit = 730;
              startTime = monthsAgoToEpoch(12 * 5); // 5 Years
              break;
            case "1Y":
              interval = "1d";
              startTime = monthsAgoToEpoch(12); // 1 Year
              break;
            case "6M":
              interval = "1d";
              startTime = monthsAgoToEpoch(6);
              break;
            case "3M":
              interval = "1d";
              startTime = monthsAgoToEpoch(3);
              break;
            case "1M":
              interval = "6h";
              startTime = monthsAgoToEpoch(1);
              break;
            case "5D":
              interval = "1h";
              startTime = daysAgoToEpoch(5);
              break;
            case "1D":
              interval = "15m";
              startTime = daysAgoToEpoch(1);
              break;
          }

          url.searchParams.set("symbol", symbol);
          url.searchParams.set("interval", interval);

          if (limit) url.searchParams.set("limit", limit.toString());
          if (startTime) url.searchParams.set("startTime", startTime.toString());

          console.log(url.href);
          const response = await fetch(url.href);
          const data = await response.json();

          if (!data.error) {
            setData(data);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }

      fetchData(selectedTimeFrame, symbol);
    }
  }, [symbol, selectedTimeFrame]);

  return (
    <Card className={className} ref={candlestickBlockRef}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{symbol ? symbol.toUpperCase() : "Loading..."}</CardTitle>
          <CardDescription>Trend line</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <CandleStickChart data={data} options={chartOptions} zoom={defaultZoom} selectedTimeFrame={selectedTimeFrame} />
        <Slider
          className="pt-5"
          defaultValue={[defaultZoom]}
          min={5}
          max={100}
          step={1}
          onValueChange={(v) => setdefaultZoom(v[0])}
        />
        <RadioGroup defaultValue="6M" onValueChange={setSelectedTimeFrame} className="flex pt-6">
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
