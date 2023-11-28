interface IResult<Success, Failure> {
  isError(this: IResult<Success, Failure>): this is Err<Success, Failure>;
  isOk(this: IResult<Success, Failure>): this is Ok<Success, Failure>;
}

type Ok<Success, Failure> = IResult<Success, Failure> & {
  tag: "Ok";
  value: Success;
};

type Err<Success, Failure> = IResult<Success, Failure> & {
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

export const ResultUtil = {
  Ok,
  Err,

  all<Success, Failure>(
    results: Result<Success, Failure>[],
  ): Result<Success[], Failure> {
    let oks: Success[] = [];

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
    let oks: Success[] = [];

    for (const item of results) {
      if (item.isOk()) {
        oks.push(item.value);
      }
    }

    return Ok(oks);
  },
};
