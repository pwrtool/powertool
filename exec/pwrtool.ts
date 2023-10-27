import { program } from "commander";
import { install, uninstall, testInstall } from "../lib/installer";
import { FancyOut } from "@pwrtool/fancy-out";
import { getKitInfo, outputKitInfo } from "../lib/info";

for (const argument of process.argv) {
  if (argument.includes("!FROM=")) {
    const dir = argument.split("=")[1];
    process.chdir(dir);
  }
}

program
  .name("pwrtool")
  .description("Automate every aspect of your workflow")
  .version("0.0.1")
  .action(() => {
    FancyOut.bold(
      "\nWelcome to PowerTool! Run `powertool --help` to see available commands.\nYou can also use the 'ptx <kit> <tool>' command to run an installed tool.\n",
    );
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
    FancyOut.bold("Uninstalling and reinstalling kit.");
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
    FancyOut.out("Run `ptx bench/test <tool>` to test your kit");
  });

program
  .command("info <kit>")
  .description("Get information about a kit from its ptinfo.yaml file")
  .action((kit: string) => {
    const info = getKitInfo(kit);
    if (typeof info === "string") {
      FancyOut.error(info);
      process.exit(1);
    }

    try {
      outputKitInfo(info, kit);
    } catch (e) {
      FancyOut.error("Kit failed to be parsed");
      process.exit(1);
    }
  });

program.parse();
