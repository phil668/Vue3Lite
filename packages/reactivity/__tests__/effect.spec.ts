import { expect, it, describe } from "vitest";
import { reactive, effect } from "../src/index";

describe("effect", () => {
  it("happy path", () => {
    const original = reactive({ foo: 1 });
    let number: any;
    effect(() => {
      number = original.foo + 1;
    });
    //effect should exectue once and bar.foo should be 1
    expect(number).toBe(2);
    original.foo++;
    // expect(bar.foo).toBe(2);
  });
});
