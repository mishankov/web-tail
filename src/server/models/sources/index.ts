import type { Source } from "./source";
import { SSHDockerSource, SSHFileSource } from "./ssh";
import { LocalDockerSource, LocalFileSource } from "./local";
import type { SourceConfig } from "../config";

function getSourceClassFromConfig(
  config: SourceConfig,
  initialLinesAmount: number,
  newLineCallback: CallableFunction
): Source {
  return new {
    "local:file": LocalFileSource,
    "local:docker": LocalDockerSource,
    "ssh:file": SSHFileSource,
    "ssh:docker": SSHDockerSource,
  }[config.type](config, initialLinesAmount, newLineCallback);
}

export { Source, getSourceClassFromConfig };
