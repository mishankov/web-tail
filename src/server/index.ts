import type { Config } from "./models/config";
import type { Source } from "./models/sources";
import { getSourceClassFromConfig } from "./models/sources";

import { join, dirname } from "path";

const express = require("express");
const rateLimit = require("express-rate-limit");
const ws = require("ws");
const fs = require("fs");
const open = require("open");

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const wss = new ws.WebSocketServer({ noServer: true });
const PORT = getConfig().port || 4444;

function getConfig() {
  let raw: string;

  try {
    raw = fs.readFileSync(
      join(dirname(process.execPath), "web-tail.config.json")
    );
  } catch {
    raw = fs.readFileSync(join(__dirname, "web-tail.config.json"));
  }
  const config: Config = JSON.parse(raw);
  return config;
}

function heartbeat() {
  this.isAlive = true;
}

let LogSource: Source;

wss.on("connection", function connection(ws, req) {
  const sourceName = req.url.split("/")[1];
  const initialLinesAmount = req.url.split("/")[2];
  console.log("Connection established", sourceName, initialLinesAmount);

  for (const source of getConfig()["sources"]) {
    if (sourceName === source.name) {
      LogSource = getSourceClassFromConfig(
        source,
        initialLinesAmount,
        function (line: string) {
          ws.send(line);
        }
      );
    }
  }

  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("close", function () {
    console.log("Connection closed");
    LogSource.closeConnection();
  });

  LogSource.configConnection();
  LogSource.startReading();
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      ws.terminate();
    } else {
      ws.isAlive = false;
      ws.ping();
    }
  });
}, 30000);

wss.on("close", function close() {
  clearInterval(interval);
});

app.use(express.static(join(__dirname, "public")));

app.get("/sources", (req, res) => {
  res.status(200).send(
    getConfig()["sources"].map((value) => {
      return value["name"];
    })
  );
});

app.get("*", function (request, response) {
  response.sendFile(join(__dirname, "public", "index.html"));
});

const server = app.listen(PORT, () =>
  console.log(`Web Tail is up => http://localhost:${PORT}`)
);
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});

if (getConfig().openBrowserOnStart) {
  open(`http://localhost:${PORT}/`);
}
