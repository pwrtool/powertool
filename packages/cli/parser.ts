export function usefulArgs(): string[] {
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].includes("ptx.ts") || process.argv[i] === "ptx") {
      return process.argv.slice(i + 1);
    }
  }

  return [];
}

// todo: make this work with users specifying an action file
// todo: make this deal with an idiot specifying only the kit or only the tool
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
