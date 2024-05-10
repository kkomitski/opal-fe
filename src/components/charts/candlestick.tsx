// @ts-nocheck
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  Date: number;
  Open: string;
  High: string;
  Low: string;
  Close: string;
  Volume: string;
  CloseTime: number;
  QuoteAssetVolume: string;
  NumberOfTrades: number;
  TakerBuyBaseAssetVolume: string;
  TakerBuyQuoteAssetVolume: string;
}

interface CandlestickChartProps {
  data: DataItem[];
}

function formatDate(epochTimestamp) {
  const date = new Date(epochTimestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/candlestick-chart
function CandlestickChartSVG(
  data,
  {
    // date = (d: any) => formatDate(d[0]), // given d in data, returns the (temporal) x-value
    date = (d: any) => d[0], // given d in data, returns the (temporal) x-value
    high = (d: any) => d[2], // given d in data, returns a (quantitative) y-value
    low = (d: any) => d[3], // given d in data, returns a (quantitative) y-value
    open = (d: any) => d[1], // given d in data, returns a (quantitative) y-value
    close = (d: any) => d[4], // given d in data, returns a (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values (defaults to every weekday)
    xRange = [marginLeft, width - marginRight], // [left, right]
    xPadding = 0.2,
    xTicks, // array of x-values to label (defaults to every other Monday)
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    // yRange = [, 800], // [bottom, top]
    xFormat = "%b %-d", // a format specifier for the date on the x-axis
    yFormat = "~f", // a format specifier for the value on the y-axis
    yLabel, // a label for the y-axis
    stroke = "currentColor", // stroke color for the daily rule
    strokeLinecap = "round", // stroke line cap for the rules
    colors = ["#4daf4a", "#999999", "#e41a1c"], // [up, no change, down]
  } = {}
) {
  data = data.slice(0, 50);
  // console.log(data);
  // Compute values.
  const X = d3.map(data, date);
  // console.log(X);
  const Yo = d3.map(data, open);
  const Yc = d3.map(data, close);
  const Yh = d3.map(data, high);
  const Yl = d3.map(data, low);
  const I = d3.range(X.length);

  const weeks = (start, stop, stride) => d3.utcMonday.every(stride).range(start, +stop + 1);
  // const weekdays = (start, stop) =>
  // d3.utcDays(start, +stop + 1).filter((d) => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);
  const weekdays = (start, stop) => {
    start = new Date(start);
    stop = new Date(stop);
    // stop.setHours(23, 59, 59, 999); // set time to just before midnight on the following day
    return d3.utcDays(start, +stop + 1).reduce((acc, d) => {
      if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) {
        acc.push(d.toISOString());
      }
      return acc;
    }, []);
    // return d3.utcDays(start, stop).map((d) => {
    //   if (d.getUTCDay() !== 6 && d.getUTCDay() !== 7) {
    //     return d.toISOString();
    //   }
    // });
  };

  // Compute default domains and ticks.
  if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
  if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
  if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

  console.log(X);

  // Construct scales and axes.
  // If you were to plot a stock using d3.scaleUtc, you’d see distracting gaps
  // every weekend. This chart therefore uses a d3.scaleBand whose domain is every
  // weekday in the dataset. A few gaps remain for holiday weekdays, such as
  // Christmas, but these are infrequent and allow the labeling of Mondays. As a
  // band scale, we specify explicit tick values.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatDate = d3.utcFormat("%B %-d, %Y");
    const formatValue = d3.format(".2f");
    const formatChange = (
      (f) => (y0, y1) =>
        f((y1 - y0) / y0)
    )(d3.format("+.2%"));
    title = (i) => `${formatDate(X[i])}
      Open: ${formatValue(Yo[i])}
      Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
      Low: ${formatValue(Yl[i])}
      High: ${formatValue(Yh[i])}`;
  } else if (title !== null) {
    const T = d3.map(data, title);
    title = (i) => T[i];
  }

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", width - marginLeft - marginRight)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );

  const g = svg
    .append("g")
    .attr("stroke", stroke)
    .attr("stroke-linecap", strokeLinecap)
    .selectAll("g")
    .data(I)
    .join("g")
    .attr("transform", (i) => {
      if (!xScale(X[i])) {
        // console.log(i);
        // console.log(xScale(X[i]));
      }
      // xScale or 0
      return `translate(${xScale(X[i]) || 0},0)`;
    });

  g.append("line")
    .attr("y1", (i) => yScale(Yl[i]))
    .attr("y2", (i) => yScale(Yh[i]));

  g.append("line")
    .attr("y1", (i) => yScale(Yo[i]))
    .attr("y2", (i) => yScale(Yc[i]))
    // .attr("stroke-width", 4)
    .attr("stroke-width", xScale.bandwidth()) // FIXME
    .attr("stroke", (i) => colors[1 + Math.sign(Yo[i] - Yc[i])]);

  if (title) g.append("title").text(title);

  return svg.node();
}

export default function CandleStickChart({ data, options }) {
  const ref = useRef(null);

  useEffect(() => {
    const newSvg = CandlestickChartSVG(data, options);
    if (ref.current.firstChild) {
      ref.current.replaceChild(newSvg, ref.current.firstChild);
    } else {
      ref.current.appendChild(newSvg);
    }
  }, [data]);

  return <div ref={ref} />;
}
