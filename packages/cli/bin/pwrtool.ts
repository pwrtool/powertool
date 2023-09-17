import { io } from "../io";
import fs from "fs";
import { awaitableSpawn } from "../";
import { program } from "commander";
import { ApplicationFiles } from "../";

const files = new ApplicationFiles();

async function install(kit: string) {
  // todo: check if the user entered <some-github-user>/<some-repo>
  // todo: if the kit is already installed, remove it and reinstall it
  // todo: check if the repo is real

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

async function uninstall(kit: string) {
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

program
  .name("pwrtool")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    console.log(
      io.bold(
        "\n\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptx <kit> <tool>' command to run an installed tool.\n"
      )
    );
  });

program
  .command("info <kit>")
  .description("Get information about an installed kit")
  .action((kit: string) => {
    console.log(kit);
  });

program
  .command("install <kit>")
  .description("Install a tool from Github to your system")
  .action(async (kit: string) => {
    await install(kit);
  });

program
  .command("update <kit>")
  .description("uninstalls and reinstalls a kit to ensure it is up to date")
  .action(async (kit: string) => {
    io.bold("Uninstalling and reinstalling kit.");
    uninstall(kit);
    await install(kit);
  });

program
  .command("uninstall <kit>")
  .description("Uninstall a tool from your system")
  .action((kit: string) => {
    uninstall(kit);
  });

program
  .command("test-install")
  .description(
    "Installs ./install.sh as a kit to the test-kit directory. You can then run `powertool run test-kit <tool>` to test your kit. This is primarily useful for developing kits"
  )
  .action(() => {
    console.log("test-install");
  });

program.parse();
