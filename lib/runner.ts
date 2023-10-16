import { ApplicationFiles } from "./application-files";
import { spawn } from "child_process";
import * as fs from "fs";
import { ParsedRunstring, generateRunstring } from "@pwrtool/runstring";
import { FancyOut } from "@pwrtool/fancy-out";
import path from "node:path";

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
  let kitFile: string = path.join(
    applicationFiles.kitsDir,
    kit.replace("/", ">"),
    "run.sh",
  );

  if (fs.existsSync(kitFile) === false) {
    FancyOut.error(`❌️ ${kitFile} was not found!`);
    process.exit(1);
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
