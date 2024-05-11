import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const endpoint = "https://api.binance.com/api/v3/klines";

  if (!req.query.symbol) return res.status(400).json({ error: "No symbol provided" });

  if (!req.query.interval) return res.status(400).json({ error: "No interval provided" });

  const symbol = req.query.symbol as string;
  const interval = req.query.interval as string;

  const url = new URL(endpoint);

  url.searchParams.set("symbol", symbol.toUpperCase());
  url.searchParams.set("interval", interval);
  if (req.query.limit) url.searchParams.set("limit", req.query.limit as string);
  if (req.query.startTime) url.searchParams.set("startTime", req.query.startTime as string);

  const response = await fetch(url.href);
  console.log();
  const data = await response.json();
  console.log(data);
  res.status(200).json(data);
}
