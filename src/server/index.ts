import type { Config, SourceConfig } from "./models/config";
import { Source, LocalFileSource, SFTPFileSource } from "./models/sources";

import { join } from "path";

const express = require("express");
const ws = require("ws");
const fs = require("fs");
const open = require("open");

const app = express();
const wss = new ws.WebSocketServer({ noServer: true });
const PORT = getConfig().port || 4444;

function getConfig() {
  let raw = fs.readFileSync(join(__dirname, "config.json"));
  let config: Config = JSON.parse(raw);
  return config;
}

function getSourceClassFromConfig(config: SourceConfig) {
  return {
    local: LocalFileSource,
    sftp: SFTPFileSource,
  }[config.type];
}

function heartbeat() {
  this.isAlive = true;
}

let LogSource: Source;

wss.on("connection", function connection(ws, req) {
  let sourceName = req.url.split("/")[1];
  let initialLinesAmount = req.url.split("/")[2];
  console.log("Connection established", sourceName, initialLinesAmount);

  for (let source of getConfig()["sources"]) {
    if (sourceName === source.name) {
      const SourceClass = getSourceClassFromConfig(source);
      LogSource = new SourceClass(source, initialLinesAmount, function (
        line: string
      ) {
        ws.send(line);
      });
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
