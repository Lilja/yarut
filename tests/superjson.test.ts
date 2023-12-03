import { expect, describe, test } from "vitest";
import superjson from "superjson";
import { Result, resultSuperRegisterRecipe } from "../src/result";
import { Option, optionSuperRegisterRecipe } from "../src/option";

superjson.registerCustom(resultSuperRegisterRecipe(superjson), "yarut/Result");
superjson.registerCustom(optionSuperRegisterRecipe(superjson), "yarut/Option");

describe("registerCustom result", () => {
  test("number", () => {
    const result = Result.Ok<number, Error>(1);
    const serialized = superjson.serialize(result);
    const deserialized =
      superjson.deserialize<Result<number, Error>>(serialized);
    if (deserialized.isOk()) {
      expect(deserialized.value).toEqual(result.value);
    } else {
      throw new Error("deserialized is not ok");
    }
  });
  test("date", () => {
    const result = Result.Ok<Date, Error>(new Date());
    const serialized = superjson.serialize(result);
    const deserialized = superjson.deserialize<Result<Date, Error>>(serialized);
    if (deserialized.isOk()) {
      expect(deserialized.value).toEqual(result.value);
    } else {
      throw new Error("deserialized is not ok");
    }
  });
  test("nested result", () => {
    const result = Result.Ok<Result<string, Error>, Error>(
      Result.Ok<string, Error>("hello"),
    );
    const serialized = superjson.serialize(result);
    const deserialized =
      superjson.deserialize<Result<Result<string, Error>, Error>>(serialized);
    if (deserialized.isOk() && deserialized.value.isOk()) {
      expect(deserialized.value.value).toEqual("hello");
    } else {
      throw new Error("deserialized is not ok");
    }
  });
});

describe("registerCustom option", () => {
  test("number", () => {
    console.log("wtf");
    const option = Option.Some<number>(1);
    const serialized = superjson.serialize(option);
    const deserialized = superjson.deserialize<Option<number>>(serialized);
    if (deserialized.isSome()) {
      expect(deserialized.value).toEqual(option.value);
    } else {
      throw new Error("deserialized is not ok");
    }
  });
  test("date", () => {
    const option = Option.Some<Date>(new Date());
    const serialized = superjson.serialize(option);
    const deserialized = superjson.deserialize<Option<Date>>(serialized);
    if (deserialized.isSome()) {
      expect(deserialized.value).toEqual(option.value);
    } else {
      throw new Error("deserialized is not ok");
    }
  });
  test("nested option", () => {
    const option: Option<Option<string>> = Option.Some(Option.Some("hello"));
    const serialized = superjson.serialize(option);
    const deserialized =
      superjson.deserialize<Option<Option<string>>>(serialized);
    if (deserialized.isSome() && deserialized.value.isSome()) {
      expect(deserialized.value.value).toEqual("hello");
    } else {
      throw new Error("deserialized is not ok");
    }
  });
});
