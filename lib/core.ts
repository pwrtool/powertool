import YAML from "yaml";
import { io } from "./kit.js";
import * as fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Config = {
  aliases: Alias[];
};

type Alias = {
  name: string;
  kit: string;
  tool: string;
};

type Installed = {
  kit: string;
  version: string;
  path: string;
  tools: InstalledTool[];
};

type InstalledTool = {
  name: string;
  description: string;
};

export function ensureApplicationFilesExist() {
  const kitsDir = `${os.homedir()}/.powertool/kits`;

  if (
    fs.existsSync(configPath) &&
    fs.existsSync(installedPath) &&
    fs.existsSync(kitsDir)
  ) {
    return;
  }
  io.warn(".powertool directory not found, initializing...");

  try {
    const configDir = `${os.homedir()}/.powertool`;
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(kitsDir, { recursive: true });

    initInstalled();
    initConfig();
  } catch (e) {
    io.error(e);
    io.error("Failed to initialize PowerTool config 😦");
    process.exit(1);
  }

  io.success("Initialized PowerTool Config! 🎉\n");
}

export function getConfig(): Config {
  const file = fs.readFileSync(configPath, "utf8");
  const config = YAML.parse(file) as Config;

  if (config === undefined) {
    throw new Error(
      "Config file could not be typecasted. Have you made an error in your config file?"
    );
  }

  return config;
}

export function getInstalled(): Installed[] {
  const file = fs.readFileSync(installedPath, "utf8");
  const installed = JSON.parse(file) as Installed[];

  if (installed === undefined) {
    throw new Error(
      "Installed file could not be typecasted. Have you made an error in your installed file?"
    );
  }

  return installed;
}

function initConfig() {
  const config = YAML.stringify(defaultConfig);
  fs.writeFileSync(configPath, config);
}

function initInstalled() {
  fs.writeFileSync(installedPath, JSON.stringify([]));
}

const configPath = `${os.homedir}/.powertool/config.yaml`;
const installedPath = `${os.homedir}/.powertool/installed.json`;
const defaultConfig = {
  aliases: [
    {
      name: "rcomp",
      kit: "firesquid6/std",
      tool: "react-component",
    },
  ],
};
