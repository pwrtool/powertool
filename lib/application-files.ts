import os from "os";
import * as fs from "fs";
import { FancyOut } from "@pwrtool/fancy-out";

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
  configDir = `${os.homedir()}/.config/powertool`;
  configPath = `${os.homedir()}/.config/powertool/config.json`;
  dataDir = `${os.homedir()}/.powertool/`;
  installedPath = `${os.homedir()}/.powertool/installed.json`;
  tempDir = `${os.homedir()}/.powertool/temp`;
  kitsDir = `${os.homedir()}/.powertool/kits`;
  defaultConfig = {
    actions: [
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
      fs.existsSync(this.dataDir) &&
      fs.existsSync(this.installedPath) &&
      fs.existsSync(this.kitsDir)
    ) {
      return;
    }
    FancyOut.warn(".powertool directory not found, initializing...");

    try {
      fs.mkdirSync(this.configDir, { recursive: true });
      fs.mkdirSync(this.tempDir, { recursive: true });
      fs.mkdirSync(this.kitsDir, { recursive: true });

      this.initInstalled();
      this.initConfig();
    } catch (e) {
      FancyOut.error(e as string);
      FancyOut.error("Failed to initialize PowerTool config 😦");
      process.exit(1);
    }

    FancyOut.success("Initialized PowerTool Config! 🎉\n");
  }

  getConfig(): object {
    const file = fs.readFileSync(this.configPath, "utf8");
    const config = JSON.parse(file);

    if (config === undefined) {
      throw new Error(
        "Config file could not be typecasted. Have you made an error in your config file?",
      );
    }

    return config;
  }

  getInstalled(): Installed[] {
    const file = fs.readFileSync(this.installedPath, "utf8");
    const installed = JSON.parse(file) as Installed[];

    if (installed === undefined) {
      throw new Error(
        "Installed file could not be typecasted. Have you made an error in your installed file?",
      );
    }

    return installed;
  }

  clearTemp() {
    if (fs.existsSync(this.tempDir) === false) {
      return;
    }
    fs.rmSync(this.tempDir, { recursive: true });
    fs.mkdirSync(this.tempDir, { recursive: true });
  }

  initConfig() {
    fs.mkdirSync(this.configDir, { recursive: true });

    const config = JSON.stringify(this.defaultConfig);
    fs.writeFileSync(this.configPath, config);
  }

  initInstalled() {
    fs.writeFileSync(this.installedPath, JSON.stringify([]));
  }
}
