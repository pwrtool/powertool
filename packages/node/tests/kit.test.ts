import { ToolRunner, Powertool } from "../lib/main.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("ToolRunner", () => {
  let runner: ToolRunner;
  const func = vi.fn();

  beforeEach(() => {
    runner = new ToolRunner();
    runner.addTool({
      name: "Test",
      description: "Does a test",
      function: func,
    });
  });

  it("should run a tool", () => {
    runner.runTool("Test");
    expect(func).toHaveBeenCalled();
  });
});

describe("Powertool", () => {
  let tool: Powertool;
  const func = vi.fn();

  beforeEach(() => {
    process.argv = ["", ""];
    tool = new Powertool();
    tool.tool("Test", "Does a test", func);
  });

  it("should run a tool", () => {
    process.argv = ["", "", "Test"];

    tool.run();
    expect(func).toHaveBeenCalled();
  });
  it("should fail if no tool is specified", () => {
    expect(() => tool.run()).toThrow();
  });
});
