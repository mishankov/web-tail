const Tail = require("tail-file");
const { spawn } = require("child_process");

import type { SourceConfig } from "../config";
import { Source } from "./source";

class LocalFileSource extends Source {
  tail: typeof Tail;

  constructor(
    config: SourceConfig,
    initialLinesAmount: number,
    newLineCallback: CallableFunction
  ) {
    super(config, initialLinesAmount, newLineCallback);
    this.tail = new Tail(this.config.path);
  }

  configConnection() {
    this.tail.on("line", (line) => {
      this.newLineCallback(line);
    });
  }

  startReading() {
    this.tail.start();
  }

  closeConnection() {
    this.tail.stop();
  }
}

class LocalDockerSource extends Source {
  process: any;

  constructor(
    config: SourceConfig,
    initialLinesAmount: number,
    newLineCallback: CallableFunction
  ) {
    super(config, initialLinesAmount, newLineCallback);
  }

  configConnection() {}

  startReading() {
    this.process = spawn("docker logs", [
      "-f",
      "-n",
      this.initialLinesAmount.toString(),
      this.config.containerId,
    ]);
    this.process.stdout.setEncoding("utf8");

    this.process.stdout.on("data", (chunk) => {
      this.newLineCallback(chunk);
    });
  }

  closeConnection() {
    this.process.kill("SIGHUP");
  }
}

export { LocalFileSource, LocalDockerSource };
