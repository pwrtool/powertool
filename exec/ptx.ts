import { runKitFile, findKitFile } from "../lib/runner";
import { parseArgs } from "../lib/parser";
import { FancyOut } from "@pwrtool/fancy-out";
import { ApplicationFiles } from "../lib/application-files";

const files = new ApplicationFiles();

const [runstring, kit] = parseArgs(process.argv);

if (kit === "") {
  FancyOut.error("No kit specified");
  process.exit(1);
}

const kitFile = findKitFile(kit, files);

FancyOut.header(
  `Running the ${runstring.tool === "" ? "default" : runstring.tool
  } tool from ${kit}`,
);

const result = await runKitFile(kitFile, runstring);

if (result !== 0) {
  FancyOut.error(`Tool exited with code ${result}`);
} else {
  FancyOut.success("Tool finished successfully.");
}

process.exit(0);
