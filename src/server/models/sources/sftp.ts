const { Client } = require("ssh2");
const { readFileSync } = require("fs");

import type { SourceConfig } from "../config";
import { Source } from "./source";

class SFTPFileSource extends Source {
  connection: typeof Client;

  constructor(
    config: SourceConfig,
    initialLinesAmount: number,
    newLineCallback: CallableFunction
  ) {
    super(config, initialLinesAmount, newLineCallback);
    this.connection = new Client();
  }

  configConnection() {
    this.connection
      .on("ready", () => {
        this.connection.exec(
          `tail -f -n ${this.initialLinesAmount} ${this.config.path}`,
          (err, stream) => {
            // if (err) throw err;
            stream
              .on("close", (code, signal) => {
                console.log(
                  "Stream :: close :: code: " + code + ", signal: " + signal
                );
                this.connection.end();
              })
              .on("data", (data) => {
                this.newLineCallback(data.toString());
              })
              .stderr.on("data", (data) => {
                console.log("STDERR: " + data);
              });
          }
        );
      })
      .on("keyboard-interactive", function (name, descr, lang, promts, finish) {
        return finish([this.config.password]);
      });
  }

  startReading() {
    const connectionParams: any = {
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
      password: this.config.password,
    };

    if (this.config.privateKeyPath !== undefined) {
      connectionParams.privateKey = readFileSync(this.config.privateKeyPath);
    }

    this.connection.connect(connectionParams);
  }

  closeConnection() {
    this.connection.destroy();
  }
}

export { SFTPFileSource };
