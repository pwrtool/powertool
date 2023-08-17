import {
  io,
  getConfig,
  getInstalled,
  ensureApplicationFilesExist,
} from "../index.js";
import { spawn } from "child_process";
io.out("\n");
ensureApplicationFilesExist();

const config = getConfig();
const installed = getInstalled();

let args = [...process.argv, "", "", "", ""];

/* GET THE KIT AND TOOL FROM THE COMMAND LINE ARGUMENTS OR ALIAS IN CONFIG FILE */
let kit: string;
let tool: string;

if (args[0] === "ptrun") {
  kit = args[1];
  tool = args[2];
} else {
  kit = args[2];
  tool = args[3];
}

if (tool === "") {
  if (config.aliases.find((alias) => alias.name === kit)) {
    const alias = config.aliases.find((alias) => alias.name === kit);
    kit = alias.kit;
    tool = alias.tool;
  } else {
    io.error(`No alias found with the name ${kit} `);
    process.exit(1);
  }
}

io.out(`Looking for ${kit} ${tool}...`);

/* FIGURE OUT WHERE THE KIT FILE IS*/
let kitFile: string;
installed.find((installedKit) => {
  if (installedKit.kit === kit) {
    const kitPath = installedKit.path;
    kitFile = `${kitPath}/index.js`;
    io.out(`Found ${kit}!`);
  }
});

/* RUN THE KIT FILE */
if (kitFile === undefined) {
  io.error(`No kit found with the name ${kit} `);
  process.exit(1);
}

io.header(`\nRunning ${kit} ${tool}...`);
spawn("node", [kitFile], { stdio: "inherit" }).on("exit", (code) => {
  if (code === 0) {
    io.success(`\nFinished running ${kit} ${tool}!\n`);
  } else {
    io.error(`\nFailed to run ${kit} ${tool} 😦\n`);
  }
});
