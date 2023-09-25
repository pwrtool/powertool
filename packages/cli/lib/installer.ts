import { ApplicationFiles } from "./application-files";
import { io } from "./io";
import { awaitableSpawn } from "./runner";
import * as fs from "fs";
import path from "node:path"

const files = new ApplicationFiles();

export async function install(kit: string) {
  // todo: check if the user entered <some-github-user>/<some-repo>

  const installDir = `${files.kitsDir}/${kit.replace("/", "-")}`;
  const repo = `https://github.com/${kit}.git`;

  try {
    io.header(`\n 🧪 Cloning repository ${repo}...`);
    await awaitableSpawn("git", ["clone", repo, files.tempDir]);

    // todo: check if there's an install.sh file and throw if it doesn't exist

    io.header(`\n 📜 Running install script...`);
    await awaitableSpawn("bash", [`${files.tempDir}/install.sh`, installDir]);

    io.success(`\n ✅️ ${kit} has been installed!`);
    files.clearTemp();
  } catch (e) {
    io.error(e as string);
  }
}

export async function uninstall(kit: string) {
  const kitDir = `${files.kitsDir}/${kit.replace("/", "-")}`;

  try {
    if (fs.existsSync(kitDir) === false) {
      throw `\n ❌️ ${kit} is not installed!`;
    }

    fs.rmdirSync(kitDir, { recursive: true });
    io.success(`\n ✅️ ${kit} has been uninstalled!`);
  } catch (e) {
    io.error(e as string);
  }
}

export async function testInstall(dir: string = ""): Promise<void> {
  const kitDir = path.join(process.cwd(), dir)
  const installDir = `${files.kitsDir}/bench-test`;

  io.header(`🔍 Searching for local install.sh`)
  if (!fs.existsSync(path.join(kitDir, "install.sh"))) {
    io.error('❌ No install.sh file was found')

    return Promise.reject()
  }

  io.header(`📜 Running install script in ${dir}`)
  try {
    await awaitableSpawn("bash", [`${kitDir}/install.sh`, installDir])
  } catch(e) {
    io.error("❌ Something bad happened...");
    io.out(e as string);
    return Promise.reject();
  }

  io.success("✅️ No errors found in install script!")
  io.out("Run your kit with: `ptx bench/test <tool> <args>`")
  return Promise.resolve();
}



