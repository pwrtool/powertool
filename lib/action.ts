import YAML from "yaml";

interface Action {
  steps: Step[];
  scratch: Map<string, string>;
}

interface Step {
  description: string;
}

interface ToolStep extends Step {
  description: string;
  kit: string;
  tool: string;
  args: ActionArg[];
  answers: string[];
}

interface SwitchStep extends Step {
  description: string;
  conditions: SwitchCondition[];
}

type SwitchCondition = {
  key: string;
  value: string;
  comparison: string;
  steps: Step[];
};

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
    parsedStep.conditions.push({
      key: condition.key,
      value: condition.value,
      comparison: condition.comparison,
      steps: [],
    });
  }

  return parsedStep;
}

// function runKitStep(step: KitStep): void {  }
//
// function runSwitchStep(step: SwitchStep): void {  }
// function runAction(action: Action): void {  }
