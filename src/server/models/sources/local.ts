const Tail = require('tail-file');

import type { SourceConfig } from "../config";
import { Source } from "./source";

class LocalFileSource extends Source {
    tail: typeof Tail;

    constructor(config: SourceConfig, newLineCallback: CallableFunction) {
        super(config, newLineCallback);
        this.tail = new Tail(this.config.path);
    }

    configConnection() {
        this.tail.on("line", line => {
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

export { LocalFileSource }
