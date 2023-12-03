interface IResult<Success, Failure> {
  isError(this: IResult<Success, Failure>): this is Err<Success, Failure>;
  isOk(this: IResult<Success, Failure>): this is Ok<Success, Failure>;
}

export type Ok<Success, Failure> = IResult<Success, Failure> & {
  tag: "Ok";
  value: Success;
};

export type Err<Success, Failure> = IResult<Success, Failure> & {
  tag: "Err";
  error: Failure;
};

export type Result<SuccessDataType, FailingDataType> =
  | Ok<SuccessDataType, FailingDataType>
  | Err<SuccessDataType, FailingDataType>;

const resultImpl = <Success, Failure>(): IResult<Success, Failure> => {
  return {
    isOk(this: Result<Success, Failure>) {
      return this.tag == "Ok";
    },
    isError(this: Result<Success, Failure>) {
      return this.tag == "Err";
    },
  };
};

export const Ok = <Success, Failure>(value: Success) => {
  return {
    tag: "Ok",
    value,
    ...resultImpl(),
  } satisfies Ok<Success, Failure>;
};

export const Err = <Success, Failure>(error: Failure) => {
  return {
    tag: "Err",
    error,
    ...resultImpl(),
  } satisfies Err<Success, Failure>;
};

/**
 * The Result class is a wrapper around the Ok and Err classes.
 * It's a helper/utility for other use cases where you want to operate on an array of Results.
 *
 * @example A function that returns a Result
 * ```typescript
 * function callApi(): Promise<Result<string, Error>> {
 *   try {
 *     const response = await fetch("https://example.com");
 *     const data = await response.json();
 *     return Ok(data);
 *   } catch (e) {
 *     return Err(e);
 *   }
 * };
 * ```
 * */
export const Result = {
  /*
   * Constructs a Result of Ok, a successful value.
   *
   * @params value: The value to be wrapped in a Result
   * @returns An Ok<T> object
   * */
  Ok,

  /**
   * Constructs a Result of Err, a failing value.
   *
   * @params error: The error to be wrapped in a Result
   * @returns An Err<T> object
   * */
  Err,

  /**
   * Returns a Result of Ok if all the results are Ok.
   * Otherwise, returns the first Err.
   *
   * @params results: An array of Result objects
   * @returns A Result object
   *
   * @example One Err in the array of results
   * ```typescript
   * const s: Result<string, Error>[] = [
   *   Err(new Error("Oh no, an error!")),
   *   Err(new Error("One more error!")),
   *   Ok("Yay"),
   * ];
   * Result.all(s) // Err(new Error("Oh no, an error!"))
   * ```
   *
   * @example No errors
   * ```typescript
   * const s: Result<string, Error>[] = [
   *   Ok("All good"),
   *   Ok("Yay"),
   * ];
   * Result.all(s) // Ok(["All good", "Yay"])
   * ```
   *
   * */
  all<Success, Failure>(
    results: Result<Success, Failure>[],
  ): Result<Success[], Failure> {
    const oks: Success[] = [];

    for (const item of results) {
      if (item.isOk()) {
        oks.push(item.value);
      } else if (item.isError()) {
        return Err(item.error);
      }
    }

    return Ok(oks);
  },

  any<Success, Failure>(
    results: Result<Success, Failure>[],
  ): Ok<Success[], Failure> {
    const oks: Success[] = [];

    for (const item of results) {
      if (item.isOk()) {
        oks.push(item.value);
      }
    }

    return Ok(oks);
  },
};
