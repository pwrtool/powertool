export interface Runstring {
  tool: string;
  arguments: Map<string, string>;
  autoAnswer: boolean;
  answers: string[];
}

export function generateRunstring(runstring: Runstring): string {
  return "";
}
