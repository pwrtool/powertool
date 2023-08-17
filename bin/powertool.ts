import chalk from "chalk";
import { program } from "commander";
import { ensureApplicationFilesExist } from "../lib/core.js";

program
  .name("powertool")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    console.log(
      chalk.blue.bold(
        "\n\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptrun' command to run an installed tool.\n\n"
      )
    );
  });

program
  .command("install <kit>")
  .description("Install a tool from the PowerTool registry")
  .action((kit: string) => {
    ensureApplicationFilesExist();
    console.log(kit);
  });

program.parse();
