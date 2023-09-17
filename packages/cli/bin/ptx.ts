import { io } from "../io";
import { usefulArgs, getKit } from "../parser";
import { runTool } from "..";

// due to the weird nature of this command, the commander package is not used. We instead just parse the command line arguments like real men.

const args = usefulArgs();
const { kit, tool } = getKit(args);
const parameters = args.slice(2);

io.header(`\n 🚀 Running ${kit}/${tool}...`);
runTool(kit, tool, parameters);
