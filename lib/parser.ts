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
    if (i <= 2 && (args[i] === "bun" || args[i] === "run")) {
      continue;
    }

    if (args[i].includes("=")) {
      const [key, value] = args[i].split("=");
      runstring.arguments.set(key, value);
    } else if (isKit(args[i])) {
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

function isKit(word: string): boolean {
  return (
    word.includes("/") &&
    !word.includes(".") &&
    !word.includes("../exec/ptx.ts")
  );
}
