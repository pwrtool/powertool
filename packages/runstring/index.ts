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

export function parseRunstring(runstring: string): ParsedRunstring {
  let parsed: ParsedRunstring = {
    tool: "",
    from: "",
    arguments: new Map(),
    autoAnswer: false,
    answers: [],
  };

  const parts = runstring.split(";");
  for (const part of parts) {
    const [key, value] = part.split(":");
    switch (key) {
      case "tool":
        parsed.tool = value;
        break;
      case "from":
        parsed.from = value;
        break;
      case "args":
        const args = part.substring(6, part.length - 2).split(",");
        for (const arg of args) {
          const [key, value] = arg.split(":");
          if (key === undefined || value === undefined) {
            continue;
          }
          parsed.arguments.set(key, value);
        }

        break;
      case "autoAnswer":
        parsed.autoAnswer = value === "t";
        break;
      case "answers":
        const answers = value.substring(1, value.length - 1).split(",");

        // for some reason there's always an empty string at the end
        // I couldn't think of a more elegant way to kill it
        if (answers[answers.length - 1] === "") {
          answers.pop();
        }

        parsed.answers = answers;
        break;
    }
  }

  return parsed;
}
