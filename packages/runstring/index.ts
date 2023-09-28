export interface ParsedRunstring {
  tool: string;
  from: string;
  arguments: Map<string, string>;
  autoAnswer: boolean;
  answers: string[];
}

export function generateRunstring(parsed: ParsedRunstring): string {
  let runstring = "";
  runstring += `tool:${parsed.tool};`;
  runstring += `from:${parsed.from};`;

  runstring += "args:[";
  for (const [key, value] of parsed.arguments.entries()) {
    runstring += `${key}:${value},`;
  }
  runstring += "];";

  runstring += `autoAnswer:${parsed.autoAnswer ? "t" : "f"};`;

  runstring += "answers:[";
  for (const answer of parsed.answers) {
    runstring += `${answer},`;
  }
  runstring += "]";

  return runstring;
}
