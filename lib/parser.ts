import { ParsedRunstring } from "@pwrtool/runstring";

export function parseArgs(args: string[]): [ParsedRunstring, string] {
  let kit = "";
  const runstring: ParsedRunstring = {
    tool: "",
    from: process.cwd(),
    arguments: new Map<string, string>(),
    answers: [],
    autoAnswer: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i].includes("=")) {
      const [key, value] = args[i].split("=");
      runstring.arguments.set(key, value);
    } else if (args[i].includes("/")) {
      kit = args[i];
    } else if (isTool(args[i])) {
      runstring.tool = args[i];
    }
  }

  return [runstring, kit];
}

function isTool(word: string): boolean {
  return !(word.includes(".") || word.includes("/") || word === "ptx");
}
