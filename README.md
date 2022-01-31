# Web tail

Web application to view lines from file on local system or on remote server built with [Svelte](https://github.com/sveltejs/svelte)

![](images/image-1.png)


## Installation
Download and unpack `web-tail-x.x.x-[platform].zip` from [latest release](https://github.com/mishankov/web-tail/releases/latest)

## Configuration
In unpacked folder edit `config.json` file

- `port` - Port that Web tail will run on. Defaults value is `4444`
- `openBrowserOnStart` - automatically open tab with Web tail in your default browser on start. Default value is `false`
- `sources` - list of sources to tail lines from
    - `name` - name of source. Mandatory field
    - `type` - type of source `local` or `sftp`. Mandatory field
    - `path` - path to file. Mandatory field
    - `host` - host of remote server. Mandatory field for source type `sftp`
    - `port` - port of remote server. Mandatory field for source type `sftp`
    - `username` - username for ssh connection to remote server. Mandatory for source type `sftp`
    - `password` - password to authenticate on remote server. Either this or `privateKeyPath` is mandatory for source type `sftp`
    - `privateKeyPath` - path to file with private key to authenticate on remote server. Either this or `password` is mandatory for source type `sftp`

## Run
You can run Web tail with node using command

```bash
node index.js
```

Or you can download and run executable for macOS, Windows or Linux

## Usage
![](images/image-2.png)

Options from left to right:
- Dropdown to select one of files from `config.json`
- Search field. Matching results will be selected. Search is case insensitive by default
- `Filter` toggle. If enabled only lines with matching results are shown
- `.*` toggle. If enabled treats text in search field as regular expression
- `Aa` toggle. If enabled makes search case sensitive
- `Reverse` toggle. If enabled latest lines shown on top
- Max lines field. How much lines will be shown 
