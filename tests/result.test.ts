import { expect, test } from "vitest";
import { Ok, Err, Result } from "../src/result";

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
  expect(Result.all(s).isError()).toBe(true);
});

test("any", () => {
  const s: Result<string, Error>[] = [
    Err(new Error("Grrr...")),
    Err(new Error("Grrr...")),
    Ok("Yay"),
  ];
  expect(Result.any(s).isOk()).toBe(true);
  expect(Result.any(s).value).toStrictEqual(["Yay"]);
});

test("type guard", () => {

  const apiCall = (id: number): Result<string, Error> => {
    if (id === 0) {
      return Ok("ok");
    }
    return Err(new Error("Grrr..."));
  }

  const result = apiCall(0);
  if (result.isError()) {
    expect(1).toBe(2);
    return
  }

  const value: Ok<string, Error> = result;
  expect(value.value).toBe("ok");
});
