import { parseActionFile } from "../lib/action";
import { describe, it, expect } from "bun:test";

const example1 = `
---
steps:
  - step: run
    description: Runs a cool tool
    kit: me/hello
    tool: say-hello
    answers:
      - idk
    args:
      foo: bar
`;

const example2 = `
---
whatever: 123
`;

describe("parseActionFile", () => {
  it("parses a simple action", () => {
    expect(parseActionFile(example1)).toEqual({
      scratch: new Map<string, string>(),
      steps: [
        {
          description: "Runs a cool tool",
          kit: "me/hello",
          tool: "say-hello",
          answers: ["idk"],
          args: [
            {
              key: "foo",
              value: "bar",
            },
          ],
        },
      ],
    });
  });

  it("throws an error if there are no steps", () => {
    expect(() => parseActionFile(example2)).toThrow("action file has no steps");
  });

  // parses scratch
  // throws error when bad args or questions are passed
  // parses switch steps
});
