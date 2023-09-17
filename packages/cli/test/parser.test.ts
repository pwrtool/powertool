import { describe, it, expect, afterEach, vi } from "vitest";
import { usefulArgs } from "../parser";

describe("usefulArgs", () => {
  afterEach(() => {
    vi.clearAllMocks();
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
