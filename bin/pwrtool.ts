#!/bin/node
import { io } from "..";
import { program } from "commander";
import { install, uninstall, testInstall } from "..";

program
  .name("pwrtool")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    console.log(
      io.bold(
        "\n\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptx <kit> <tool>' command to run an installed tool.\n",
      ),
    );
  });

program
  .command("hello")
  .description("Says hello. I needed this when making sure bunx works properly")
  .action(() => {
    io.out("hello world!");
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
    "Installs ./install.sh as a kit to the test-kit directory. You can then run `ptx bench/test <tool>` to test your kit. This is primarily useful for developing kits",
  )
  .action(async () => {
    await testInstall();
    io.out("Run `ptx bench/test <tool>` to test your kit");
  });

program.parse();
