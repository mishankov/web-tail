import { fileURLToPath } from 'url';
import { join, dirname } from "path";
import fs from "fs";
import toml from "toml";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getConfig() {
    let raw: string;
  
    try {
      raw = fs.readFileSync(
        join(dirname(process.execPath), "web-tail.config.toml")
      );
    } catch {
      raw = fs.readFileSync(join(__dirname, "web-tail.config.toml"));
    }
    const config: Config = toml.parse(raw);
    return config;
  }