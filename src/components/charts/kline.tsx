// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3"; // TODO: Change to named imports instead of default
import { getTickFormat } from "./kline.utils";
import KlineUtils from "./kline.utils";
import { formatFloat } from "@/lib/utils";

function CandlestickChartSVG(
  data,
  zoom = 100,
  selectedTimeFrame,
  parent,
  {
    date = (d: any) => new Date(d[0]), // given d in data, returns the (temporal) x-value
    high = (d: any) => parseFloat(d[2]), // given d in data, returns a (quantitative) y-value
    low = (d: any) => parseFloat(d[3]), // given d in data, returns a (quantitative) y-value
    open = (d: any) => parseFloat(d[1]), // given d in data, returns a (quantitative) y-value
    close = (d: any) => parseFloat(d[4]), // given d in data, returns a (quantitative) y-value
    // title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 50, // left margin, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values (defaults to every weekday)
    xPadding = 0.4,
    xTicks, // array of x-values to label (defaults to every other Monday)
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat = "~f", // a format specifier for the value on the y-axis
    stroke = "currentColor", // stroke color for the daily rule
    strokeLinecap = "round", // stroke line cap for the rules
    colors = ["#4daf4a", "#999999", "#e41a1c"], // [up, no change, down]
    extraStrokeThickness = 0,
  } = {}
) {
  // Return empty div if no data
  // TODO: Replace with spinner
  if (!data) return document.createElement("div");

  // Config
  const width = parent.parentElement.offsetWidth;
  const format = KlineUtils.getTickFormat(selectedTimeFrame);
  const xRange = [marginLeft, width - marginRight]; // [left, right]

  // Invert zoom in order to have 0 on the slider and covert to percentage
  const zoomInverted = 105 - zoom;
  const zoomToDecimal = zoomInverted * 0.01;
  const zoomPercentOfTotal = data.length * zoomToDecimal;

  // Slice data based on zoom (cuts from the front of the array)
  data = data && data.slice(Math.max(data.length - zoomPercentOfTotal, 0));

  // Compute values.
  const x_DatesArr = d3.map(data, date);
  const y_Open = d3.map(data, open);
  const y_Close = d3.map(data, close);
  const y_High = d3.map(data, high);
  const y_Low = d3.map(data, low);
  const IndexArr = d3.range(x_DatesArr.length);

  // Range finders
  const minutes = (start, stop, stride) => d3.utcMinute.range(start, +stop + 1, stride ? stride : 1);
  const hours = (start, stop, stride) => d3.utcHour.range(start, +stop + 1, stride ? stride : 1);
  const days = (start, stop, stride) => d3.utcDay.range(start, +stop + 1, stride ? stride : 1);
  const weeks = (start, stop, stride) => d3.utcMonday.range(start, +stop + 1, stride ? stride : 1);
  const months = (start, stop, stride) => d3.utcMonth.range(start, +stop + 1, stride ? stride : 1);
  const years = (start, stop, stride) => d3.utcYear.range(start, +stop + 1, stride ? stride : 1);

  // Compute domains
  if (!xDomain) {
    switch (selectedTimeFrame) {
      case "All":
        xDomain = weeks(d3.utcMonth.floor(d3.min(x_DatesArr)), d3.max(x_DatesArr));
        break;
      case "5Y":
        xDomain = weeks(d3.min(x_DatesArr), d3.max(x_DatesArr));
        break;
      case "1Y":
        xDomain = days(d3.min(x_DatesArr), d3.max(x_DatesArr));
        break;
      case "6M":
        xDomain = days(d3.min(x_DatesArr), d3.max(x_DatesArr));
        break;
      case "3M":
        xDomain = days(d3.min(x_DatesArr), d3.max(x_DatesArr));
        break;
      case "1M":
        xDomain = hours(d3.min(x_DatesArr), d3.max(x_DatesArr), 6);
        break;
      case "5D":
        xDomain = hours(d3.min(x_DatesArr), d3.max(x_DatesArr));
        break;
      case "1D":
        xDomain = minutes(d3.min(x_DatesArr), d3.max(x_DatesArr), 15);
        break;
    }
  }

  if (yDomain === undefined) yDomain = [d3.min(y_Low), d3.max(y_High)];

  // Compute scales
  const xScale = d3.scaleBand(xDomain, xRange);

  const generateTicks = () => {
    const start = d3.min(xDomain);
    const stop = d3.max(xDomain);

    switch (selectedTimeFrame) {
      // 6 month intervals
      case "All":
      case "5Y":
        return weeks(d3.utcYear.floor(start), stop, 26.0715);

      // Once a month
      case "1Y":
      case "6M":
        return months(d3.utcMonth.floor(start), stop, 1);

      // Once every 2 weeks
      case "3M":
        return weeks(d3.utcMonth.floor(start), stop, 2);

      // Once a week
      case "1M":
        return weeks(d3.utcMonth.floor(start), stop, 1);

      // Once a day
      case "5D":
        return days(start, stop, 1);

      // Once every 2 hours
      case "1D":
        return minutes(start, stop, 120);
    }
  };

  if (xTicks === undefined) xTicks = generateTicks();

  const yScale = yType(yDomain, yRange);

  // Compute axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(format)).tickValues(xTicks);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  /**
   * Generate chart SVG
   */

  // Canvas
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic; width: 100%;");

  // Create the Y axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick text").attr("font-size", 12)); // Increase font-size

  // Y axis values
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick text").attr("font-size", 12)) // Increase font-size
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", width - marginLeft - marginRight)
    )
    .call(
      (g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 20)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-size", 20)
      // .text(yLabel)
    );

  /**
   *  xAxis
   */

  // Plot values
  const g = svg
    .append("g")
    .attr("stroke", stroke)
    .attr("stroke-linecap", strokeLinecap)
    .selectAll("g")
    .data(IndexArr)
    .join("g")
    .attr("transform", (i) => `translate(${xScale(x_DatesArr[i])},0)`)
    .attr("open", (i) => formatFloat(y_Open[i]))
    .attr("close", (i) => formatFloat(y_Close[i]))
    .attr("high", (i) => formatFloat(y_High[i]))
    .attr("low", (i) => formatFloat(y_Low[i]))
    // .attr("time", (i) => d3.utcFormat(format));
    .attr("time", (i) => d3.utcFormat("%Y/%m/%d %H:%M")(x_DatesArr[i]))
    .attr("positive", (i) => y_Open[i] < y_Close[i]);

  g.append("line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "transparent")
    .attr("hover", true)
    .attr("stroke-width", () => xScale.bandwidth());

  // Plot Wick - Low and high
  g.append("line")
    .attr("type", "wick")
    .attr("y1", (i) => yScale(y_Low[i]))
    .attr("y2", (i) => yScale(y_High[i]));

  // Candle - Open and close
  g.append("line")
    .attr("type", "candle")
    .attr("y1", (i) => yScale(y_Open[i])) // Open
    .attr("y2", (i) => yScale(y_Close[i])) // Close
    .attr("stroke-width", () => xScale.padding(xPadding).bandwidth() + extraStrokeThickness)
    .attr("stroke", (i) => colors[1 + Math.sign(y_Open[i] - y_Close[i])]);

  return svg.node();
}

export default function CandleStickChart({ data, options, className, zoom, selectedTimeFrame }: any) {
  const svgContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState(null);
  const [crosshair, setCrosshair] = useState(null);

  const handleTooltip = (e) => {
    if (e.target.tagName === "line") {
      const g = e.target.parentElement;

      const open = g.getAttribute("open");
      const close = g.getAttribute("close");
      const high = g.getAttribute("high");
      const low = g.getAttribute("low");
      const time = g.getAttribute("time");

      setTooltipData({ isActive: true, open, close, high, low, time });
    }
  };

  // TODO: Finish implementing
  // const handleCrosshair = (e) => {
  //   const crshr = (
  //     <>
  //       <div
  //         style={{
  //           left: `${e.pageX}px`,
  //           top: 0,
  //         }}
  //         className="vt relative z-50 h-full border border-dashed border-primary-muted"
  //       ></div>
  //       <div
  //         style={{
  //           top: `${e.pageY}px`,
  //           // top: `calc(${e.pageY}px - 100%)`,
  //           left: 0,
  //         }}
  //         className="hl relative z-50 w-full border border-dashed border-primary-muted"
  //       ></div>
  //     </>
  //   );

  //   setCrosshair(crshr);
  // };

  useEffect(() => {
    setLoading(true); 

    if (!svgContainerRef.current) return;

    // If no data or no data length
    if(!data || !data.length) {
      return
    }

    const el = svgContainerRef.current;

    setTooltipData({ isActive: false });

    const newSvg = CandlestickChartSVG(data, zoom, selectedTimeFrame, el, options);
    if (el.firstChild) {
      setLoading(false);
      el.replaceChild(newSvg, el.firstChild);
    } else {
      setLoading(false);
      el.appendChild(newSvg);
    }
  }, [data, options, zoom, selectedTimeFrame]);

  return (
    <>
      <div
        // onMouseMove={(e) => handleCrosshair(e)}
        onMouseLeave={() => setCrosshair(null)}
        className={`flex justify-center items-center cursor-crosshair min-w-full overflow-hidden ${
          className && className
        }`}
      >
        {/* <div className="cursor absolute top-0 left-0 h-full w-full z-50">{crosshair}</div> */}
        <p>{loading ? "Loading..." : null}</p>
        <KlineUtils.Tooltip {...tooltipData} />
        <div ref={svgContainerRef} onMouseMove={handleTooltip} />
      </div>
    </>
  );
}
