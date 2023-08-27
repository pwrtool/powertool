import { io } from "../lib/kit.js";
import { awaitableSpawn } from "../lib/core.js";
import { program } from "commander";
import { ApplicationFiles } from "../lib/core.js";

const files = new ApplicationFiles();

program
  .name("pt")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    console.log(
      io.bold(
        "\n\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptrun' command to run an installed tool.\n\n"
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
  .command("qrun <alias>")
  .description(
    "Run a tool from an installed kit using an alias you have defined"
  )
  .action((alias: string) => {
    console.log(alias);
  });

program
  .command("template <template>")
  .description("Copies all files from a template into your directory")
  .action((template: string) => {
    console.log(template);
  });

program.command("q").description;

program
  .command("info <kit>")
  .description("Get information about an installed kit")
  .action((kit: string) => {
    console.log(kit);
  });

program
  .command("install <kit>")
  .description("Install a tool from the PowerTool registry")
  .action(async (kit: string) => {
    // todo: check if the user entered <some-github-user>/<some-repo>
    // todo: check if kit is already installed
    // todo: check if the repo is real

    const installDir = `${files.kitsDir}/${kit.replace("/", "-")}`;
    console.log(installDir);
    const repo = `https://github.com/${kit}.git`;

    io.header(`\n 🧪 Cloning repository ${repo}...`);
    await awaitableSpawn("git", ["clone", repo, files.tempDir]);

    // todo: check if there's an install.sh file and throw if it doesn't exist

    io.header(`\n 📜 Running install script...`);
    await awaitableSpawn("bash", [`${files.tempDir}/install.sh`, installDir]);

    io.success(`\n ✔️ ${kit} has been installed!`);

    files.clearTemp();
  });

program
  .command("uninstall <kit>")
  .description("Uninstall a tool from the PowerTool registry")
  .action((kit: string) => {
    console.log(kit);
  });

program
  .command("list")
  .description("List all installed kits and tools")
  .action(() => {
    console.log("list");
  });

program.parse();
