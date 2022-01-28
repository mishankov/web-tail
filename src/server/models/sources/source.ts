import type { SourceConfig } from "../config";


abstract class Source {
    config: SourceConfig;
    newLineCallback: CallableFunction;
    initialLinesAmount: number;

    constructor(config: SourceConfig, initialLinesAmount: number, newLineCallback: CallableFunction) {
        this.config = config;
        this.newLineCallback = newLineCallback;
        this.initialLinesAmount = initialLinesAmount || 0;
    }

    abstract configConnection()
    abstract startReading()
    abstract closeConnection()
}

export { Source }
