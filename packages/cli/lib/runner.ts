import { ApplicationFiles } from "./application-files";
import { io } from "./io";
import { spawn } from "child_process";
import * as fs from "fs";

export async function runTool(kit: string, tool: string, parameters: string[]) {
  // todo: add error handling for when a kit or tool is not found
  try {
    io.header(`\n 🔎 Looking for ${kit}...`);
    const applicationFiles = new ApplicationFiles();
    const kitFile = findKitFile(kit, applicationFiles);

    io.header(`\n 🚀 Running ${kit}/${tool}...`);
    const exitCode = await runKitFile(kitFile, tool, parameters);

    if (exitCode === ExitCode.Success) {
      io.success(`\n ✅ ${kit}/${tool} ran successfully!`);
    } else {
      io.error(`\n ❌ ${kit}/${tool} failed to run!`);
    }
  } catch (e) {
    io.error(e as string);
  }

  process.exit(0);
}

export async function awaitableSpawn(
  command: string,
  args: string[]
): Promise<ExitCode> {
  return new Promise<ExitCode>((resolve, reject) => {
    const process = () => spawn(command, args, { stdio: "inherit" });

    process().on("close", (code) => {
      if (code === 0) {
        resolve(ExitCode.Success);
      } else {
        reject(ExitCode.Failure);
      }
    });
  });
}

function findKitFile(kit: string, applicationFiles: ApplicationFiles): string {
  let kitFile: string = "";
  const installed = applicationFiles.getInstalled();

  installed.find((installedKit) => {
    if (installedKit.kit === kit) {
      const kitPath = installedKit.path;
      kitFile = `${kitPath}/run.sh`;
    }
  });

  if (kitFile === "" || fs.existsSync(kitFile) === false) {
    throw new Error(`\n❌ Kit ${kit}'s run.sh file could not be found!`);
  }

  return kitFile;
}

async function runKitFile(
  filename: string,
  tool: string,
  parameters: string[]
) {
  return await awaitableSpawn(filename, [tool, ...parameters]);
}

enum ExitCode {
  Success = 0,
  Failure = 1,
}
