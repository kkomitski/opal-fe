import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.query.sbl) {
    const symbol = req.query.sbl as string;
    console.log(`https://api.binance.com/api/v3/avgPrice=${symbol.toUpperCase()}`);
    const response = await fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol.toUpperCase()}`);
    const data = await response.json();
    console.log(data);
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "No symbol provided" });
  }
}
