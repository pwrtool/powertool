import { describe, it, expect, afterEach } from "vitest";
import { usefulArgs, getParameters, getKit } from "../parser";

const originalArgv = process.argv;

describe("usefulArgs", () => {
  afterEach(() => {
    process.argv = originalArgv;
  });
  it("should deal with a dev environment", () => {
    process.argv = ["bun", "run", "bin/ptx.ts", "dev", "test", "morestuff"];
    expect(usefulArgs()).toEqual(["dev", "test", "morestuff"]);
  });
  it("should deal with it being called with bunx", () => {
    process.argv = ["bunx", "ptx", "dev", "test", "morestuff"];
    expect(usefulArgs()).toEqual(["dev", "test", "morestuff"]);
  });
  it("should deal with being called with nothing", () => {
    process.argv = ["ptx", "dev", "test", "morestuff"];
    expect(usefulArgs()).toEqual(["dev", "test", "morestuff"]);
  });
  it("should deal with some moron naming the kit weirdly", () => {
    process.argv = ["ptx", "ptx", "test", "morestuff"];
    expect(usefulArgs()).toEqual(["ptx", "test", "morestuff"]);
  });
});

describe("getParameters", () => {
  it("should return an empty array if there are no parameters", () => {
    expect(getParameters(["dev", "test", "morestuff"])).toEqual([]);
  });
  it("should deal with out of order params", () => {
    expect(
      getParameters(["dev", "test", "morestuff", "param=1", "param2=2"])
    ).toEqual(["param=1", "param2=2"]);
  });
});

describe("getKit", () => {
  it("should return the kit and tool", () => {
    expect(getKit(["dev", "test", "morestuff"])).toEqual({
      kit: "dev",
      tool: "test",
    });
  });
});
