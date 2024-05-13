import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useRouter } from "next/router";

type Props = {};

const SearchInstruments = (props: Props) => {
  const [instrumentSearchData, setInstrumentSearchData] = useState<any>([]);

  const router = useRouter();

  // On click of a search result, redirect to the instrument page
  const handleOnSelect = (item: any) => {
    console.log(item);

    const urlWithInstrument = new URL(window.location.href);
    urlWithInstrument.searchParams.set("symbol", item.queryName);

    // This line replaces the current URL without refreshing page
    router.push(urlWithInstrument.pathname + urlWithInstrument.search, undefined, { shallow: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.binance.com/api/v3/exchangeInfo");
        const dataJson = await response.json();

        const filteredData: any = [];

        dataJson.symbols.forEach((item: any) => {
          if (item.status === "TRADING")
            filteredData.push({ id: item.symbol, name: item.symbol, queryName: item.symbol });
        });

        setInstrumentSearchData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <form className="ml-auto flex-1 sm:flex-initial bg-background z-[9999]">
        <div className="relative">
          <ReactSearchAutocomplete
            onSelect={handleOnSelect}
            className="flex h-10 w-full rounded-md sm:w-[300px] md:w-[200px] cursor-pointer lg:w-[300px]"
            items={instrumentSearchData}
            showClear={true}
            maxResults={5}
            inputDebounce={100}
            placeholder="Search"
            styling={{
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              backgroundColor: "rgb(3, 7, 18)",
              fontSize: "0.875rem",
              color: "rgb(249, 250, 251)",
              lineColor: "var(--accent)",
              hoverBackgroundColor: "rgba(0, 128, 255, 0.9)",
            }}
          />
        </div>
      </form>
    </>
  );
};

export default SearchInstruments;
