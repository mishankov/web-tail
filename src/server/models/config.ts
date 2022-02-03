interface Config {
  sources: Array<SourceConfig>;
  openBrowserOnStart?: boolean;
  port?: number;
}

interface SourceConfig {
  name: string;
  type: "local:file" | "local:docker" | "ssh:file" | "ssh:docker";
  path: string;

  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKeyPath?: string;

  containerId?: string;
}

export type { Config, SourceConfig };
