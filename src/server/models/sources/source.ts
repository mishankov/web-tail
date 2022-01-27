import type { SourceConfig } from "../config";


abstract class Source {
    config: SourceConfig;
    newLineCallback: CallableFunction

    constructor(config: SourceConfig, newLineCallback: CallableFunction) {
        this.config = config;
        this.newLineCallback = newLineCallback;
    }

    abstract configConnection()
    abstract startReading()
    abstract closeConnection()
}

export { Source }
