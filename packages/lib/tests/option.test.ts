import { expect, test } from "vitest";
import { Option, Some, None, OptionUtil } from "../src/option";

test("some case", () => {
  const s = Some("Hi");

  expect(s.tag).toBe("Some");
  expect(s.isSome()).toBe(true);
  if (s.isSome()) {
    let val: string = s.value;
    expect(val).toBe("Hi");
  }
  expect(s.isNone()).toBe(false);
});

test("none case", () => {
  const s = None();

  expect(s.tag).toBe("None");
  expect(s.isSome()).toBe(false);
  expect(s.isNone()).toBe(true);
});

test("all", () => {
  const arr: Option<string>[] = [
    None(),
    Some("hi"),
    Some("haha"),
  ];

  const out = OptionUtil.all(arr);
  expect(out.isNone()).toBe(true);
});

test("any", () => {
  const arr: Option<string>[] = [
    None(),
    Some("hi"),
    Some("haha"),
  ];

  const out = OptionUtil.any(arr);
  expect(out.value.length).toBe(2);
});
