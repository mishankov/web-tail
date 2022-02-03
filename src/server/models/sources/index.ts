import type { Source } from "./source";
import { SSHFileSource } from "./ssh";
import { LocalFileSource } from "./local";
import type { SourceConfig } from "../config";

function getSourceClassFromConfig(
  config: SourceConfig,
  initialLinesAmount: number,
  newLineCallback: CallableFunction
): Source {
  return new {
    "local:file": LocalFileSource,
    "ssh:file": SSHFileSource,
  }[config.type](config, initialLinesAmount, newLineCallback);
}

export { Source, getSourceClassFromConfig };
