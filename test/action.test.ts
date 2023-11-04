import { parseActionFile, runKitStep, KitRunner } from "../lib/action";
import { describe, it, expect, mock } from "bun:test";
import { ParsedRunstring } from "@pwrtool/runstring";

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

const example3 = `
---
steps:
  - step: switch
    description: Does a thingy
    conditions:
      - comparison: =
        key: foo
        value: bar
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

const example4 = `
---
scratch:
  foo: bar
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

const example5 = `
---
steps:
  - step: run
    kit: me/no-description
    tool: default
    answers:
      - idk
    args:
      this: step has no description
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
  it("parses a switch statement", () => {
    const expected = {
      scratch: new Map<string, string>(),
      steps: [
        {
          description: "Does a thingy",
          conditions: [
            {
              key: "foo",
              value: "bar",
              comparison: "=",
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
            },
          ],
        },
      ],
    };

    const result = parseActionFile(example3);
    // @ts-ignore
    console.log(result.steps[0].conditions);
    expect(Bun.deepEquals(result, expected)).toBeTrue();
  });

  it("throws an error if there are no steps", () => {
    expect(() => parseActionFile(example2)).toThrow("action file has no steps");
  });
  it("parses scratch", () => {
    expect(parseActionFile(example4)).toEqual({
      scratch: new Map([["foo", "bar"]]),
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
  it("deals with steps without a description", () => {
    expect(parseActionFile(example5)).toEqual({
      scratch: new Map<string, string>(),
      steps: [
        {
          kit: "me/no-description",
          tool: "default",
          answers: ["idk"],
          args: [
            {
              key: "this",
              value: "step has no description",
            },
          ],
        },
      ],
    });
  });
});

describe("runKitStep", () => {
  it("it runs a step", async () => {
    const mockKitRunner = mock((kit: string, runstring: ParsedRunstring) => {
      return new Map<string, string>();
    });

    runKitStep(
      {
        kit: "me/hello",
        tool: "say-hello",
        args: [],
        answers: [],
      },
      mockKitRunner,
    );
  });
});
