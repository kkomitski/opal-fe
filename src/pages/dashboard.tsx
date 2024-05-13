import CandlestickBlock from "@/components/molecules/kline-block";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TradesCard from "@/components/atoms/trades-card";
import InstrumentCardCollection from "@/components/molecules/instrument-cards-collection";

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export const iframeHeight = "825px";

export const containerClassName = "w-full h-full";

export default function Dashboard() {
  const { asPath } = useRouter();
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(asPath.substring(1));
    const symbolParam = searchParams.get("symbol");

    if (symbolParam) {
      setSymbol(symbolParam);
    } else {
      setSymbol("BTCUSDT");
    }
  }, [asPath, symbol]);

  return (
    <>
      <InstrumentCardCollection symbol={symbol} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <CandlestickBlock
          symbol={symbol}
          className="col-span-2 flex flex-col justify-between"
          chartOptions={{
            yLabel: "↑ Price ($)",
            xLabel: "Time",
          }}
        />

        <TradesCard symbol={symbol} />
      </div>
    </>
  );
}
