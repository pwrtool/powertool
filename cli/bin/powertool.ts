import { io } from "@pwrtool/kit";
import fs from "fs";
import { awaitableSpawn } from "../lib/core.js";
import { program } from "commander";
import { ApplicationFiles } from "../lib/core.js";

const files = new ApplicationFiles();

program
  .name("pwrtool")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    console.log(
      io.bold(
        "\n\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptrun' command to run an installed tool.\n"
      )
    );
  });

program
  .command("run <kit> <tool>")
  .description("Run a tool from an installed kit")
  .action((kit: string, tool: string) => {
    console.log(kit, tool);
  });

program
  .command("arun <alias>")
  .description(
    "Run a tool from an installed kit using an alias you have defined"
  )
  .action((alias: string) => {
    console.log(alias);
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
      io.error(e);
    }
  });

program
  .command("uninstall <kit>")
  .description("Uninstall a tool from your system")
  .action((kit: string) => {
    io.out(`\n 🗑️ Uninstalling ${kit}...`);
    const kitDir = `${files.kitsDir}/${kit.replace("/", "-")}`;

    try {
      if (fs.existsSync(kitDir) === false) {
        throw `\n ❌️ ${kit} is not installed!`;
      }

      fs.rmdirSync(kitDir, { recursive: true });
      io.success(`\n ✅️ ${kit} has been uninstalled!`);
    } catch (e) {
      io.error(e);
    }
  });

program
  .command("list")
  .description("List all installed kits and tools")
  .action(() => {
    console.log("list");
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
