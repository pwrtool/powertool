import chalk from "chalk";
import { program } from "commander";

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

program.command("component <name>").action((name) => {
  console.log(`Creating component ${name}`);
});

program.parse();
