import { ParsedRunstring } from "@pwrtool/runstring";

// DEPRECATED
export function usefulArgs(): string[] {
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].includes("ptx.ts") || process.argv[i] === "ptx") {
      return process.argv.slice(i + 1);
    }
  }

  return [];
}

// DEPRECATED
export function getKit(args: string[]): {
  kit: string;
  tool: string;
} {
  return {
    kit: args[0],
    tool: args[1],
  };
}

export function getParameters(args: string[]): string[] {
  const params: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].includes("=")) {
      params.push(args[i]);
    }
  }

  return params;
}

export function parseArgs(args: string[]): [ParsedRunstring, string] {
  let kit = "";
  const runstring: ParsedRunstring = {
    tool: "",
    from: process.cwd(),
    arguments: new Map<string, string>(),
    answers: [],
    autoAnswer: false,
  };

  return [runstring, kit];
}
