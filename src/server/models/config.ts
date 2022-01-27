interface Config {
    sources: Array<SourceConfig>
}

interface SourceConfig {
    name: string
    type: "local" | "sftp"
    path: string

    host?: string
    port?: number
    username?: string
    password?: string
}

export type {Config, SourceConfig}
