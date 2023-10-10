// why do I exist?
import { runTool, awaitableSpawn } from "./lib/runner";
import { io } from "./lib/io";
import { usefulArgs, getParameters, getKit } from "./lib/parser";
import { ApplicationFiles } from "./lib/application-files";
import { install, uninstall, testInstall } from "./lib/installer";

export {
  runTool,
  awaitableSpawn,
  io,
  usefulArgs,
  getParameters,
  getKit,
  ApplicationFiles,
  install,
  uninstall,
  testInstall,
};
