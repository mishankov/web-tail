interface Config {
  sources: Array<SourceConfig>;
  openBrowserOnStart?: boolean;
  port?: number;
}

interface SourceConfig {
  name: string;
  type: "local" | "sftp";
  path: string;

  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKeyPath?: string;
}

export type { Config, SourceConfig };
