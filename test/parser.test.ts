import { describe, test, expect } from "bun:test";
import { parseArgs } from "../lib/parser";

describe("parser", () => {
  test("should parse a simple string", () => {
    expect(parseArgs(["ptx", "me/mykit", "mytool", "arg1=val1"])).toEqual([
      {
        tool: "mytool",
        from: process.cwd(),
        arguments: new Map([["arg1", "val1"]]),
        answers: [],
        autoAnswer: false,
      },
      "me/mykit",
    ]);
  });
  test("should deal with no tool", () => {
    expect(parseArgs(["ptx", "me/mykit", "arg1=val1"])).toEqual([
      {
        tool: "",
        from: process.cwd(),
        arguments: new Map([["arg1", "val1"]]),
        answers: [],
        autoAnswer: false,
      },
      "me/mykit",
    ]);
  });
  test("should deal with no args", () => {
    expect(parseArgs(["ptx", "me/mykit", "mytool"])).toEqual([
      {
        tool: "mytool",
        from: process.cwd(),
        arguments: new Map(),
        answers: [],
        autoAnswer: false,
      },
      "me/mykit",
    ]);
  });
  test("should deal with no kit", () => {
    expect(parseArgs(["ptx", "mytool", "arg1=val1"])).toEqual([
      {
        tool: "mytool",
        from: process.cwd(),
        arguments: new Map([["arg1", "val1"]]),
        answers: [],
        autoAnswer: false,
      },
      "",
    ]);
  });
  test("should deal with a bun run call", () => {
    expect(
      parseArgs([
        "bun",
        "run",
        "../long/path/to/thing",
        "me/mykit",
        "mytool",
        "arg1=val1",
      ]),
    ).toEqual([
      {
        tool: "mytool",
        from: process.cwd(),
        arguments: new Map([["arg1", "val1"]]),
        answers: [],
        autoAnswer: false,
      },
      "me/mykit",
    ]);
  });
  test("should deal with an empty call", () => {
    expect(parseArgs(["bun", "run", "../exec/ptx.ts"])).toEqual([
      {
        tool: "",
        from: process.cwd(),
        arguments: new Map(),
        answers: [],
        autoAnswer: false,
      },
      "",
    ]);
  });
  test("should deal with custom from", () => {
    expect(
      parseArgs([
        "bun",
        "run",
        "../exec/ptx.ts",
        "!FROM=/hello/world/",
        "me/mykit",
        "coolTool",
        "arg1=2",
      ]),
    ).toEqual([
      {
        tool: "coolTool",
        from: "/hello/world/",
        arguments: new Map([["arg1", "2"]]),
        answers: [],
        autoAnswer: false,
      },
      "me/mykit",
    ]);
  });
  test("should deal with a test run", () => {
    expect(
      parseArgs([
        "bun",
        "run",
        "../exec/pwrtool.ts",
        "test-install",
        "mytool",
        "arg1=val1",
      ]),
    ).toEqual([
      {
        tool: "mytool",
        from: process.cwd(),
        arguments: new Map([["arg1", "val1"]]),
        answers: [],
        autoAnswer: false,
      },
      "",
    ]);
  });
});
