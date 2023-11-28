import { expect, test } from "vitest";
import { Ok, Err, ResultUtil, Result } from "../src/result";

test("ok", () => {
  const s: Result<string, Error> = Ok("ok");
  expect(s.isOk()).toBe(true);
});

test("err", () => {
  const s: Result<string, Error> = Err(new Error("Grrr..."));
  expect(s.isOk()).toBe(false);
});

test("all", () => {
  const s: Result<string, Error>[] = [
    Err(new Error("Grrr...")),
    Err(new Error("Grrr...")),
    Ok("Yay"),
  ];
  expect(ResultUtil.all(s).isError()).toBe(true);
});

test("any", () => {
  const s: Result<string, Error>[] = [
    Err(new Error("Grrr...")),
    Err(new Error("Grrr...")),
    Ok("Yay"),
  ];
  expect(ResultUtil.any(s).isOk()).toBe(true);
  expect(ResultUtil.any(s).value).toStrictEqual(["Yay"]);
});
