import { findTool } from "..";
import { test, describe, expect } from "bun:test";

describe("findTool", () => {
  test("finds theTreasure", () => {
    process.argv = [
      "bun",
      "run",
      "index.ts",
      "theTreasure",
      "arg1=2",
      "arg3=3",
    ];
    expect(findTool()).toBe("theTreasure");
  });

  test("deals with node", () => {
    process.argv = ["node", "index.ts", "theTreasure", "arg1=2", "arg3=3"];
    expect(findTool()).toBe("theTreasure");
  });
  test("deals with no arguments", () => {
    process.argv = ["node", "index.ts", "arg1=2"];
    expect(findTool()).toBe(undefined);
  });
});
