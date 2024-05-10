import CandleStickChart from "@/components/charts/candlestick";
import React, { useEffect, useState } from "react";
import originalData from "@/lib/aapl.json";
import bnbbtc from "@/lib/bnbbtc.json";

type Props = {};

const Candlestick = (props: Props) => {
  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, []); // Empty dependency array means this effect runs once on mount

  // Rest of your component...
};
export default Candlestick;

import { SearchType } from "@/components/tables/InstrumentTable/InstrumentTableTypes";
import { HTMLAttributes, useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

type Props = {
  placeholderText: string;
  searchType?: SearchType | null;
  theme?: "azure" | "transparent-light";
} & HTMLAttributes<HTMLDivElement>;

type InstrumentData = {
  apiCode: string;
  name: string;
  url: string;
  class: SearchType;
};

const InstrumentsSearch = (props: Props) => {
  const { placeholderText, searchType, theme = "azure", ...rest } = props;
  const [instrumentSearchData, setInstrumentSearchData] = useState([]);

  // Apply the css theme to the component. Can be updated in _instrument-searchbar.scss
  const themeClassMap = {
    azure: "instrument-search-azure",
    "transparent-light": "instrument-search-transparent-light",
  };

  // On click of a search result, redirect to the instrument page
  const handleOnSelect = (item: InstrumentData) => {
    window.location.href = `https://www.cmcmarkets.com/en-gb/instruments/${item.url}?search=1`;
  };

  const filterTo = searchType;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ws.cmcmarkets.com/json/instruments_gb.json");
        const jsonData = await response.json();
        let filteredData = [];

        // If search type specified, filter data
        if (searchType != null) {
          filteredData =
            filterTo !== null ? jsonData.filter((obj: InstrumentData) => obj.class === filterTo) : jsonData;
        }
        // If no search type specified, return all data
        else {
          filteredData = jsonData;
        }

        // Map data to match react-search-autocomplete props
        filteredData = filteredData.map(({ apiCode, name, url }: InstrumentData) => ({
          id: apiCode,
          name,
          url,
        }));
        setInstrumentSearchData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      {...rest}
      className={`instrument-search relative w-full xs:max-w-[360px] ${themeClassMap[theme]} ${rest.className}`}
    >
      <ReactSearchAutocomplete
        onSelect={handleOnSelect}
        className="z-20"
        items={instrumentSearchData}
        maxResults={5}
        inputDebounce={100}
        placeholder={placeholderText}
        styling={{
          hoverBackgroundColor: "#ADBFFF",
        }}
      />
      <svg
        className="search-icon absolute left-4 top-3.5 z-20"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 14.3354L10 10.3354M11.3333 7.00212C11.3333 9.57944 9.244 11.6688 6.66667 11.6688C4.08934 11.6688 2 9.57944 2 7.00212C2 4.42479 4.08934 2.33545 6.66667 2.33545C9.244 2.33545 11.3333 4.42479 11.3333 7.00212Z"
          stroke="inherit"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default InstrumentsSearch;
