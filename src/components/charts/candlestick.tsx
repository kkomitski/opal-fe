// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function epochToISO(epochTimestamp: EpochTimeStamp) {
  const date = new Date(epochTimestamp);
  return date.toISOString();
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp); // Convert to Date object
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 indexed so +1 and pad with 0 if necessary
  const day = ("0" + date.getDate()).slice(-2); // Pad with 0 if necessary
  return `${year}-${month}-${day}`;
}

function isoToEpoch(isoDateString) {
  const date = new Date(isoDateString);
  return date.getTime();
}

function CandlestickChartSVG(
  data,
  zoom = 100,
  selectedTimeFrame,
  parent,
  {
    // date = (d: any) => formatDate(d[0]), // given d in data, returns the (temporal) x-value
    // date = (d: any) => epochToISO(d[0]), // given d in data, returns the (temporal) x-value
    // date = (d: any) => formatTimestamp(d[0]), // given d in data, returns the (temporal) x-value
    date = (d: any) => new Date(d[0]), // given d in data, returns the (temporal) x-value
    high = (d: any) => d[2], // given d in data, returns a (quantitative) y-value
    low = (d: any) => d[3], // given d in data, returns a (quantitative) y-value
    open = (d: any) => d[1], // given d in data, returns a (quantitative) y-value
    close = (d: any) => d[4], // given d in data, returns a (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    height = 400, // outer height, in pixels
    width = parent.parentElement.offsetWidth, // outer width, in pixels
    xDomain, // array of x-values (defaults to every weekday)
    xRange = [marginLeft, width - marginRight], // [left, right]
    xPadding = 0.2,
    xTicks, // array of x-values to label (defaults to every other Monday)
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    // yRange = [, 800], // [bottom, top]
    xFormat = "%d %b '%y", // a format specifier for the date on the x-axis
    yFormat = "~f", // a format specifier for the value on the y-axis
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    stroke = "currentColor", // stroke color for the daily rule
    strokeLinecap = "square", // stroke line cap for the rules
    colors = ["#4daf4a", "#999999", "#e41a1c"], // [up, no change, down]
  } = {}
) {
  if (!data) return document.createElement("div");

  // console.log(data);
  console.log("selected", parent.parentElement.offsetWidth);
  width = parent.parentElement.offsetWidth;

  // Invert zoom in order to have 0 on the slider
  const zoomInverted = 105 - zoom;
  const zoomToDecimal = zoomInverted * 0.01;
  const zoomPercent = data.length * zoomToDecimal;

  console.log(zoomPercent + 100);

  data = data && data.slice(-zoomPercent);

  // Compute values.
  const X = d3.map(data, date);
  const Yo = d3.map(data, open);
  const Yc = d3.map(data, close);
  const Yh = d3.map(data, high);
  const Yl = d3.map(data, low);
  const I = d3.range(X.length);

  const minutes = (start, stop) => d3.utcMinutes(start, +stop + 1);
  const hours = (start, stop) => d3.utcHour.range(start, +stop, 1);
  const days = (start, stop) => d3.utcDay.range(start, +stop + 1);
  const weeks = (start, stop) => d3.utcMonday.range(start, +stop, 1);

  let extraStrokeThickness = 0;

  // Compute default domains and ticks
  if (!xDomain) {
    switch (selectedTimeFrame) {
      case "All":
        xDomain = weeks(d3.min(X), d3.max(X));
        break;
      case "5Y":
        xDomain = weeks(d3.min(X), d3.max(X));
        break;
      case "1Y":
        xDomain = days(d3.min(X), d3.max(X));
        break;
      case "6M":
        xDomain = days(d3.min(X), d3.max(X));
        break;
      case "3M":
        xDomain = hours(d3.min(X), d3.max(X));
        extraStrokeThickness = 5;
        break;
      case "1M":
        xDomain = hours(d3.min(X), d3.max(X));
        extraStrokeThickness = 3;
        break;
      case "5D":
        xDomain = hours(d3.min(X), d3.max(X));
        break;
      case "1D":
        xDomain = minutes(d3.min(X), d3.max(X));
        extraStrokeThickness = 5
        break;
    }
  }
  // if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];

  // Construct scales and axes.
  // If you were to plot a stock using d3.scaleUtc, you’d see distracting gaps
  // every weekend. This chart therefore uses a d3.scaleBand whose domain is every
  // weekday in the dataset. A few gaps remain for holiday weekdays, such as
  // Christmas, but these are infrequent and allow the labeling of Mondays. As a
  // band scale, we specify explicit tick values.

  // console.log(xDomain)
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);

  const generateTicks = () => {
    // const start = isoToEpoch(d3.min(X));
    // const stop = isoToEpoch(d3.max(X));
    // const start = d3.min(xDomain);
    const start = d3.min(xDomain);
    const stop = d3.max(xDomain);

    // console.log(xDomain);
    console.log(start);
    console.log(stop);
    const stride = 1; // adjust this value as needed

    switch (selectedTimeFrame) {
      case "All":
        return xScale.domain().filter(function (d, i) {
          return !(i % 25);
        });
      // return weeks(d3.min(xDomain), d3.max(xDomain))
      case "5Y":
        return xScale.domain().filter(function (d, i) {
          return !(i % 20);
        });
      case "1Y":
        return xScale.domain().filter(function (d, i) {
          return !(i % 30);
        });
      case "6M":
        return xScale.domain().filter(function (d, i) {
          return !(i % 30);
        });
      case "3M":
        return xScale.domain().filter(function (d, i) {
          return !(i % 250);
        });
      case "1M":
        return xScale.domain().filter(function (d, i) {
          return !(i % 100);
        });
      case "5D":
        return xScale.domain().filter(function (d, i) {
          return !(i % 20);
        });
      default:
        return xScale.domain().filter(function (d, i) {
          return !(i % 250);
        });
    }
  };

  // if (xTicks === undefined) xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);
  if (xTicks === undefined) xTicks = generateTicks();

  // const xScale = d3
  //   .scaleBand()
  //   .domain([d3.min(xDomain), d3.max(xDomain)])
  //   .range(xRange)
  //   .padding(xPadding);

  const yScale = yType(yDomain, yRange);
  console.log(xTicks.length);
  // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
  // const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
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
    .attr("style", "max-width: 100%; height: auto; height: intrinsic; width: 100%;");

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);
  // .call((g) => g.select(".domain").remove());

  console.log("1", marginLeft);
  console.log("2", height - marginBottom);

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    // .call((g) => g.select(".domain").remove())
    .call(
      (g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("stroke-opacity", 0.2)
          .attr("x2", width - marginLeft - marginRight)
      // .text(xLabel)
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
      return `translate(${xScale(X[i])},0)`;
    });

  g.append("line")
    .attr("y1", (i) => yScale(Yl[i]))
    .attr("y2", (i) => yScale(Yh[i]));

  g.append("line")
    .attr("y1", (i) => yScale(Yo[i]))
    .attr("y2", (i) => yScale(Yc[i]))
    .attr("stroke-width", xScale.bandwidth() + extraStrokeThickness)
    .attr("stroke", (i) => colors[1 + Math.sign(Yo[i] - Yc[i])]);

  if (title) g.append("title").text(title);

  return svg.node();
}

export default function CandleStickChart({ data, options, className, zoom, selectedTimeFrame }: any) {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    setLoading(true);
    const newSvg = CandlestickChartSVG(data, zoom, selectedTimeFrame, el, options);
    if (ref?.current?.firstChild) {
      setLoading(false);
      ref.current.replaceChild(newSvg, ref.current.firstChild);
    } else {
      setLoading(false);
      ref.current.appendChild(newSvg);
    }
  }, [data, options, zoom, selectedTimeFrame]);

  return (
    <div
      className={`flex justify-center items-center min-w-full ${
        className && className
      }`}
    >
      <p>{loading ? "Loading..." : null}</p>
      <div ref={ref} />
    </div>
  );
}
