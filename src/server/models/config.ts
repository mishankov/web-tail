interface Config {
  sources: SourceConfig[];
  servers?: ServerConfig[];
  openBrowserOnStart?: boolean;
  port?: number;
}

interface ServerConfig {
  name: string
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKeyPath?: string;
}

interface SourceConfig {
  name: string;
  type: "local:file" | "local:docker" | "ssh:file" | "ssh:docker";
  path: string;

  serverName?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKeyPath?: string;

  containerId?: string;
}

export type { Config, SourceConfig };
