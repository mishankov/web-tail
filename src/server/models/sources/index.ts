import type { Source } from "./source";
import { SSHDockerSource, SSHFileSource } from "./ssh";
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
    "ssh:docker": SSHDockerSource,
  }[config.type](config, initialLinesAmount, newLineCallback);
}

export { Source, getSourceClassFromConfig };
