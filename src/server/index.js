const express = require('express');
const Tail = require('tail-file');
const ws = require('ws');
const fs = require('fs');
const { Client } = require('ssh2');

const app = express();

const wss = new ws.WebSocketServer({ noServer: true });

function getConfig() {
    let raw = fs.readFileSync('/Users/mishankov/Documents/Git/web-tail/src/server/config.json');
    let config = JSON.parse(raw);
    return config
}

function heartbeat() {
    this.isAlive = true;
};

wss.on('connection', function connection(ws, req) {
    sourceName = req.url.split('/')[1];
    console.log('Connection established', sourceName);

    ws.isAlive = true;
    ws.on("pong", heartbeat);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    for (let source of getConfig()['sources']) {
        if (sourceName === source.name) {
            if (source.type === 'local') {
                const mytail = new Tail(source.path);

                mytail.on("line", line => {
                    ws.send(line);
                });

                mytail.start();
            } else if (source.type === 'sftp') {
                const conn = new Client();
                conn.on('ready', () => {
                    console.log('Client :: ready');
                    conn.exec(`tail -f -n 0 ${source.path}`, (err, stream) => {
                        if (err) throw err;
                        stream.on('close', (code, signal) => {
                            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                            conn.end();
                        }).on('data', (data) => {
                            console.log('STDOUT: ' + data);
                            ws.send(data.toString());
                        }).stderr.on('data', (data) => {
                            console.log('STDERR: ' + data);
                        });
                    });
                }).on('keyboard-interactive', function(name, descr, lang, promts, finish) {
                    return finish([source.password]);
                }).connect({
                    host: source.host,
                    port: source.port,
                    username: source.username,
                    password: source.password,
                    tryKeyboard: true
                });
            }
        }
    };
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
