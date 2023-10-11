import { describe, test, expect } from "bun:test";

describe("parser", () => {
  test("should parse a simple string", () => {
    expect("hello").toEqual("hello");
  });
});
