import type { Config, SourceConfig } from "./models/config";
import { Source, LocalFileSource, SFTPFileSource } from "./models/sources";

const express = require('express');
const Tail = require('tail-file');
const ws = require('ws');
const fs = require('fs');
const { Client } = require('ssh2');

const app = express();

const wss = new ws.WebSocketServer({ noServer: true });

function getConfig() {
    let raw = fs.readFileSync('/Users/mishankov/Documents/Git/web-tail/dist/config.json');
    let config: Config = JSON.parse(raw);
    return config
}

function getSourceClassFromConfig(config: SourceConfig) {
    return {
        local: LocalFileSource,
        sftp: SFTPFileSource
    }[config.type]
}

function heartbeat() {
    this.isAlive = true;
};

let LogSource: Source;

wss.on('connection', function connection(ws, req) {
    let sourceName = req.url.split('/')[1];
    console.log('Connection established', sourceName);

    for (let source of getConfig()["sources"]) {
        if (sourceName === source.name) {
            const SourceClass = getSourceClassFromConfig(source);
            LogSource = new SourceClass(source, function(line: string) {
                ws.send(line);
            });
        }
    }

    ws.isAlive = true;
    ws.on("pong", heartbeat);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.on('close', function() {
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

wss.on('close', function close() {
    clearInterval(interval);
});




const server = app.listen(8081);
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});
