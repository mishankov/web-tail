import type { Config } from "./models/config";
import type { Source } from "./models/sources";
import { getSourceClassFromConfig } from "./models/sources";

import { join, dirname } from "path";

const express = require("express");
const rateLimit = require("express-rate-limit");
const ws = require("ws");
const fs = require("fs");
const open = require("open");
const toml = require("toml");

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
      join(dirname(process.execPath), "web-tail.config.toml")
    );
  } catch {
    raw = fs.readFileSync(join(__dirname, "web-tail.config.toml"));
  }
  const config: Config = toml.parse(raw);

  config.sources.forEach((value, sourceIndex) => {
    if (value.serverName) {
      const serverName = value.serverName;
      config.servers.forEach((value) => {
        if (value.name === serverName) {
          config.sources[sourceIndex].host =
            config.sources[sourceIndex].host || value.host;
          config.sources[sourceIndex].port =
            config.sources[sourceIndex].port || value.port;
          config.sources[sourceIndex].username =
            config.sources[sourceIndex].username || value.username;
          config.sources[sourceIndex].password =
            config.sources[sourceIndex].password || value.password;
          config.sources[sourceIndex].privateKeyPath =
            config.sources[sourceIndex].privateKeyPath || value.privateKeyPath;
        }
      });
    }
  });

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
      try {
        LogSource = getSourceClassFromConfig(
          source,
          initialLinesAmount,
          function (line: string) {
            ws.send(line);
          }
        );
      } catch (err) {
        console.log(
          `Unable to determine log source type. Error: ${err.toString()}`
        );
      }
    }
  }

  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("close", function () {
    if (LogSource !== undefined) {
      LogSource.closeConnection();
      console.log("Connection closed");
    }
  });

  try {
    LogSource.configConnection();
    LogSource.startReading();
  } catch (err) {
    ws.send(err.toString());
    ws.close();
  }
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
