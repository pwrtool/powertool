import YAML from "yaml";
import { ParsedRunstring } from "@pwrtool/runstring";

export interface Action {
  steps: Step[];
  scratch: Map<string, string>;
}

export interface Step {
  description: string;
}

export interface ToolStep extends Step {
  description: string;
  kit: string;
  tool: string;
  args: ActionArg[];
  answers: string[];
}

export interface SwitchStep extends Step {
  description: string;
  conditions: SwitchCondition[];
}

export type SwitchCondition = {
  key: string;
  value: string;
  comparison: COMPARISONS;
  steps: Step[];
};

enum COMPARISONS {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
}

type ActionArg = {
  key: string;
  value: string;
};

export function parseActionFile(fileData: string): Action {
  // icky gross. There's probably a better way to do this
  const parsed: any = YAML.parse(fileData);
  const action: Action = {
    steps: [],
    scratch: new Map<string, string>(),
  };

  if (parsed.scratch !== undefined) {
    try {
      const entries = Object.entries(parsed.scratch);
      for (let i = 0; i < entries.length; i++) {
        const scratch = entries[i];
        action.scratch.set(scratch[0] as string, scratch[1] as string);
      }
    } catch (e) {
      throw "failed to parse scratch";
    }
  }

  if (parsed.steps === undefined) {
    throw new Error("action file has no steps");
  }

  for (const step of parsed.steps) {
    action.steps.push(parseStep(step));
  }

  return action;
}

function parseStep(step: any): Step {
  switch (step.step) {
    case "run":
      return parseRunStep(step);
    case "switch":
      return parseSwitchStep(step);
    case undefined:
      throw new Error("step type is undefined");
    default:
      throw new Error(`unknown step type: ${step.step}`);
  }
}

function parseRunStep(step: any): ToolStep {
  const parsedStep: ToolStep = {
    description: step.description,
    kit: step.kit,
    tool: step.tool,
    args: [],
    answers: [],
  };

  if (step.args !== undefined) {
    try {
      const entries = Object.entries(step.args);
      for (let i = 0; i < entries.length; i++) {
        const arg = entries[i];
        parsedStep.args.push({
          key: arg[0] as string,
          value: arg[1] as string,
        });
      }
    } catch (e) {
      throw "failed to parse args";
    }
  }

  if (step.answers !== undefined) {
    try {
      for (const answer of step.answers) {
        parsedStep.answers.push(answer);
      }
    } catch (e) {
      throw "failed to parse answers";
    }
  }

  return parsedStep;
}

function parseSwitchStep(step: any): SwitchStep {
  const parsedStep: SwitchStep = {
    description: step.description,
    conditions: [],
  };

  for (const condition of step.conditions) {
    const unparsedSteps = condition.steps;
    const parsedSteps: Step[] = [];
    for (const unparsedStep of unparsedSteps) {
      parsedSteps.push(parseStep(unparsedStep));
    }

    parsedStep.conditions.push({
      key: condition.key,
      value: condition.value,
      comparison: condition.comparison,
      steps: parsedSteps,
    });
  }

  return parsedStep;
}

export interface KitRunner {
  runKit: (kit: string, runstring: ParsedRunstring) => Map<string, string>;
}

const kitRunner: KitRunner = {
  runKit: (kit: string, runstring: ParsedRunstring) => {
    return new Map<string, string>();
  },
};

export function runKitStep(step: Step, kitRunner: KitRunner): void { }

// function runSwitchStep(step: SwitchStep): void {  }
// function runAction(action: Action): void {  }
