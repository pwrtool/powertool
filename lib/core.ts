import YAML from "yaml";
import { spawn } from "child_process";
import { io } from "./kit.js";
import * as fs from "fs";
import os from "os";

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

export class ApplicationFiles {
  configPath = `${os.homedir}/.powertool/config.yaml`;
  installedPath = `${os.homedir}/.powertool/installed.json`;
  tempDir = `${os.homedir}/.powertool/temp`;
  kitsDir = `${os.homedir}/.powertool/kits`;
  defaultConfig = {
    aliases: [
      {
        name: "rcomp",
        kit: "firesquid6/std",
        tool: "react-component",
      },
    ],
  };

  constructor() {
    this.clearTemp();

    if (
      fs.existsSync(this.configPath) &&
      fs.existsSync(this.installedPath) &&
      fs.existsSync(this.kitsDir)
    ) {
      return;
    }
    io.warn(".powertool directory not found, initializing...");

    try {
      const configDir = `${os.homedir()}/.powertool`;
      fs.mkdirSync(configDir, { recursive: true });
      fs.mkdirSync(this.kitsDir, { recursive: true });

      this.initInstalled();
      this.initConfig();
    } catch (e) {
      io.error(e);
      io.error("Failed to initialize PowerTool config 😦");
      process.exit(1);
    }

    io.success("Initialized PowerTool Config! 🎉\n");
  }

  getConfig(): Config {
    const file = fs.readFileSync(this.configPath, "utf8");
    const config = YAML.parse(file) as Config;

    if (config === undefined) {
      throw new Error(
        "Config file could not be typecasted. Have you made an error in your config file?"
      );
    }

    return config;
  }

  getInstalled(): Installed[] {
    const file = fs.readFileSync(this.installedPath, "utf8");
    const installed = JSON.parse(file) as Installed[];

    if (installed === undefined) {
      throw new Error(
        "Installed file could not be typecasted. Have you made an error in your installed file?"
      );
    }

    return installed;
  }

  clearTemp() {
    fs.rmSync(this.tempDir, { recursive: true });
    fs.mkdirSync(this.tempDir, { recursive: true });
  }

  private initConfig() {
    const config = YAML.stringify(this.defaultConfig);
    fs.writeFileSync(this.configPath, config);
  }

  private initInstalled() {
    fs.writeFileSync(this.installedPath, JSON.stringify([]));
  }
}

export async function runTool(kit: string, tool: string) {
  // todo: add error handling for when a kit or tool is not found
  io.header(`\n 🔎 Looking for ${kit}...`);
  const applicationFiles = new ApplicationFiles();
  const kitFile = findKitFile(kit, applicationFiles);

  io.header(`\n 🚀 Running ${kit}/${tool}...`);
  const exitCode = await runKitFile(kitFile, tool);

  if (exitCode === ExitCode.Success) {
    io.success(`\n ✅ ${kit}/${tool} ran successfully!`);
  } else {
    io.error(`\n ❌ ${kit}/${tool} failed to run!`);
  }

  process.exit(0);
}

export async function awaitableSpawn(
  command: string,
  args: string[]
): Promise<ExitCode> {
  return new Promise<ExitCode>((resolve, reject) => {
    const process = () => spawn(command, args, { stdio: "inherit" });

    process().on("close", (code) => {
      if (code === 0) {
        resolve(ExitCode.Success);
      } else {
        reject(ExitCode.Failure);
      }
    });
  });
}

function findKitFile(kit: string, applicationFiles: ApplicationFiles): string {
  let kitFile: string;
  const installed = applicationFiles.getInstalled();

  installed.find((installedKit) => {
    if (installedKit.kit === kit) {
      const kitPath = installedKit.path;
      kitFile = `${kitPath}/index.js`;
    }
  });

  return kitFile;
}

enum ExitCode {
  Success = 0,
  Failure = 1,
}

async function runKitFile(filename: string, tool: string) {
  return await awaitableSpawn("node", [filename, tool]);
}
