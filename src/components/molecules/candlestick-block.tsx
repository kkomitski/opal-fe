import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CandleStickChart from "../charts/candlestick";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Slider } from "../ui/slider";

type Props = {};

const CandlestickBlock = ({ title, chartProps, className }: any) => {
  const [zoom, setZoom] = useState(10);
  const candlestickBlockRef = useRef<HTMLDivElement>(null);

  chartProps.options.zoom = zoom;

  const extendedChartProps = {
    ...chartProps,
    options: {
      ...chartProps.options,
      zoom,
    },
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      chartProps.width = candlestickBlockRef?.current?.offsetWidth;
    });
    // console.log(candlestickBlockRef.current.offsetWidth);
  }, []);

  return (
    <Card className={className} ref={candlestickBlockRef}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{title}</CardTitle>
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
        {/* <CandleStickChart {...chartProps} /> */}
        <CandleStickChart {...extendedChartProps} />
        <Slider defaultValue={[33]} max={100} step={1} onValueChange={(v) => setZoom(v[0])} />
      </CardContent>
    </Card>
  );
};

export default CandlestickBlock;
