import { ApplicationFiles } from "./application-files";
import { awaitableSpawn } from "./runner";
import { FancyOut } from "@pwrtool/fancy-out";
import * as fs from "fs";
import path from "node:path";

const files = new ApplicationFiles();

export async function install(kit: string) {
  // todo: check if the user entered <some-github-user>/<some-repo>

  const installDir = `${files.kitsDir}/${kit.replace("/", ">")}`;
  const repo = `https://github.com/${kit}.git`;

  try {
    FancyOut.header(`\n 🧙 cloning repository ${repo}...`);
    await awaitableSpawn("git", ["clone", repo, files.tempDir]);
    FancyOut.success("Repo cloned successfully!");

    // todo: check if there's an install.sh file and throw if it doesn't exist

    FancyOut.header(`\n 📜 Running install script...`);
    await awaitableSpawn("bash", [`${files.tempDir}/install.sh`, installDir]);

    FancyOut.success(`\n ✅️ ${kit} has been installed!`);
    files.clearTemp();
  } catch (e) {
    FancyOut.error("❌️ Something bad happened...");
    FancyOut.out(e as string);
  }
}

export async function uninstall(kit: string) {
  const kitDir = `${files.kitsDir}/${kit.replace("/", ">")}`;

  try {
    if (fs.existsSync(kitDir) === false) {
      throw `❌️ ${kit} is not installed!`;
    }

    fs.rmdirSync(kitDir, { recursive: true });
    FancyOut.success(`\n ✅️ ${kit} has been uninstalled!`);
  } catch (e) {
    FancyOut.error("❌️ Something went wrong...");
    FancyOut.out(e as string);
  }
}

export async function testInstall(): Promise<void> {
  const kitDir = path.join(process.cwd());
  fs.rmdirSync(`${files.kitsDir}/bench>test`, { recursive: true });

  FancyOut.header(`🔍 Searching for local install.sh`);
  FancyOut.out("📂 Using kit directory: " + kitDir);
  const installDir = `${files.kitsDir}/bench>test`;
  if (!fs.existsSync(path.join(kitDir, "install.sh"))) {
    FancyOut.error("❌ No install.sh file was found");

    return Promise.reject();
  }
  FancyOut.out("✅️ Found install.sh file");

  FancyOut.header(`📜 Running install script in ${kitDir}`);
  try {
    await awaitableSpawn("bash", [`${kitDir}/install.sh`, installDir]);
  } catch (e) {
    FancyOut.error("❌ Something bad happened...");
    FancyOut.out(e as string);
    return Promise.reject();
  }

  FancyOut.success("✅️ No errors found in install script!");
  FancyOut.out("Run your kit with: `ptx bench/test <tool> <args>`");
  return Promise.resolve();
}
