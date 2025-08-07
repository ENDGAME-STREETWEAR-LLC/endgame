import { curly } from "node-libcurl";
import express from "express";
import { config } from "dotenv";

config();

const XBOX_API_KEY = process.env.XBOX_API_KEY;
if (!XBOX_API_KEY) throw new Error("Missing env variable: XBOX_API_KEY");

const app = express();

app.get("/express/achievements", async (req, res) => {
  const { xuid } = req.query;
  if (!xuid) {
    return res.status(400).json({ message: "Missing XUID" });
  }

  const { data, statusCode } = await curly.get(
    `https://xbl.io/api/v2/achievements/player/${xuid}`,
    {
      httpHeader: [`x-authorization: ${XBOX_API_KEY}`, "Accept: application/json"],
    }
  );
  return res.status(statusCode).json(data);
});

app.listen(3000, () => {
  console.log("Express server listening on port: 3000");
});
