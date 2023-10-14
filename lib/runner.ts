import { ApplicationFiles } from "./application-files";
import { spawn } from "child_process";
import * as fs from "fs";
import { ParsedRunstring, generateRunstring } from "@pwrtool/runstring";

export async function awaitableSpawn(
  command: string,
  args: string[],
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

export function findKitFile(
  kit: string,
  applicationFiles: ApplicationFiles,
): string {
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

export async function runKitFile(filename: string, runstring: ParsedRunstring) {
  const arg = generateRunstring(runstring);

  return await awaitableSpawn(filename, [arg]);
}

export enum ExitCode {
  Success = 0,
  Failure = 1,
}
