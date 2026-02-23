# Web tail

[![CI](https://github.com/mishankov/web-tail/actions/workflows/ci.yml/badge.svg)](https://github.com/mishankov/web-tail/actions/workflows/ci.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/mishankov/web-tail/badge)](https://www.codefactor.io/repository/github/mishankov/web-tail)

Web application to view lines from file on local system or on remote server built with [Svelte](https://github.com/sveltejs/svelte).

![](images/image-1.png)

## Installation

Download executable for your platform from [latest release](https://github.com/mishankov/web-tail/releases/latest).

Docker image is also available [here](https://github.com/mishankov/web-tail/pkgs/container/web-tail).

## Configuration

Configuaration is done with `web-tail.config.toml` file. Following keys are available:

- `port` - port that Web tail will run on. Default value is `4444`
- `allowedOrigins` - list of allowed origins for WebSocket connections. Default value is `["*"]`
- `servers` - reusable servers configuration
  - `name` - name of server to use in `sources` configs
  - `host` - host of remote server. Mandatory field for source types `ssh:*`
  - `port` - port of remote server. Mandatory field for source types `ssh:*`
  - `username` - username for ssh connection to remote server. Mandatory for source types `ssh:*`
  - `password` - password to authenticate on remote server. Either this or `privateKeyPath` is mandatory for source types `ssh:*`
  - `privateKeyPath` - path to file with private key to authenticate on remote server. Either this or `password` is mandatory for source types `ssh:*`
- `sources` - list of sources to tail lines from
  - `name` - name of source. Mandatory field
  - `type` - type of source. Possible values: `local:file`, `local:docker`, `local:openclaw`, `ssh:file`, `ssh:docker`, `ssh:openclaw`. Mandatory field
  - `path` - path to file. Mandatory field for source types `*:file`
  - `serverName` - name of a server from `servers` list
  - `containerId` - Docker container ID. Mandatory field for source types `*:docker`
  - `host` - host of remote server. Mandatory field for source types `ssh:*`
  - `port` - port of remote server. Mandatory field for source types `ssh:*`
  - `username` - username for ssh connection to remote server. Mandatory for source types `ssh:*`
  - `password` - password to authenticate on remote server. Either this or `privateKeyPath` is mandatory for source types `ssh:*`
  - `privateKeyPath` - path to file with private key to authenticate on remote server. Either this or `password` is mandatory for source types `ssh:*`

String fields support environment placeholders in the exact form `${VAR_NAME}`.
If a placeholder is used and the environment variable is not set, `web-tail` fails to start with a config error.
Only exact placeholders are expanded, so values like `prefix-${VAR_NAME}` stay unchanged.

Example:

```toml
[[servers]]
name = "production"
host = "${SSH_HOST}"
port = 22
username = "${SSH_USER}"
password = "${SSH_PASSWORD}"
privateKeyPath = "${SSH_PRIVATE_KEY_PATH}"

[[sources]]
name = "app-log"
type = "ssh:file"
path = "/var/log/app.log"
serverName = "production"
```

## Usage

![](images/image-2.png)

Options from left to right:

- Dropdown to select one of sources from `web-tail.config.toml`
- Search field. Matching results will be selected. Search is case insensitive by default
- `Filter` toggle. If enabled only lines with matching results are shown
- `.*` toggle. If enabled treats text in search field as regular expression
- `Aa` toggle. If enabled makes search case sensitive
- `Reverse` toggle. If enabled latest lines shown on top
- Max lines field. How much lines will be shown

## Development

Frontend app lives in `/client` and uses Bun + Vite.

1. Install frontend dependencies:
   - `cd client && bun install`
2. Build frontend assets for Go embed:
   - `cd client && bun run build`
3. Run backend:
   - `go run ./server`

For frontend HMR in development, run both services:

- `go run ./server`
- `cd client && bun run dev`

Vite dev server proxies `/sources` and `/logstream` to `http://localhost:4444`.
