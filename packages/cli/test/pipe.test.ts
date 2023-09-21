import { pipe } from "../lib/pipe";
import { describe, it, expect } from "vitest";

describe("pipe", () => {
  it("should pipe", () => {
    expect(pipe(1, (x: number) => x + 1)).toBe(2);
  });
  it("should deal with multiple functions", () => {
    expect(
      pipe(
        1,
        (x: number) => x + 1,
        (x: number) => x + 1,
        (x: number) => x + 1
      )
    ).toBe(4);
  });
});
