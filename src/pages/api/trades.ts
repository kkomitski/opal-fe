import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const endpoint = "https://api.binance.com/api/v3/trades";

  if (!req.query.symbol) return res.status(400).json({ error: "No symbol provided" });

  const symbol = req.query.symbol as string;

  const url = new URL(endpoint);

  url.searchParams.set("symbol", symbol.toUpperCase());

  if (req.query.limit) url.searchParams.set("limit", req.query.limit as string);

  const response = await fetch(url.href);
  const data = await response.json();

  if (!response.ok) return res.status(400).json({ error: "Error fetching data", message: data.msg });
  // console.log(data);
  res.status(200).json(data);
}
