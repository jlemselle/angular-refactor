import { add } from "./add";

describe("add", () => {
  it("should add 1 + 1", () => {
    expect(add(1, 1)).toBe(2);
  });
});
