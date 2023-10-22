type Action = {
  description: string;
  steps: Step[];
};

interface Step {
  description: string;
}

interface KitStep extends Step {
  description: string;
  kit: string;
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

// function parseActionFile(fileData: string): Action {  }
