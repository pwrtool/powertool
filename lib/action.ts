type Action = {
  name: string;
  steps: ActionStep[];
};

interface ActionStep {
  name: string;
}

interface KitStep extends ActionStep {
  name: string;
  kit: string;
  args: ActionArg[];
  answers: string[];
}

interface ShellStep extends ActionStep {
  command: string;
}

type ActionArg = {
  key: string;
  value: string;
};
