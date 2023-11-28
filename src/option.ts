interface IOption<T> {
  isSome(this: IOption<T>): this is Some<T>;
  isNone(this: IOption<T>): this is None<T>;
}

type Some<T> = IOption<T> & {
  tag: "Some";
  value: T;
};

type None<N> = IOption<N> & {
  tag: "None";
};

export type Option<T> = Some<T> | None<T>;

/**
 * Implements functions that are both related to Some and None.
 * Like, `isSome` and `isNone`
 *
 * */
const optionImpl = <T>(): IOption<T> => {
  return {
    isSome(this: Option<T>) {
      return this.tag === "Some";
    },
    isNone(this: Option<T>) {
      return this.tag == "None";
    },
  };
};

export const Some = <T>(value: T) => {
  return {
    tag: "Some",
    value,
    ...optionImpl(),
  } satisfies Some<T>;
};

export const None = <T>() => {
  return {
    tag: "None",
    ...optionImpl(),
  } satisfies None<T>;
};

// Helper/utility for other use cases where you want to operate on an array of Options.
export const OptionUtil = {
  Some,
  None,

  all<T>(options: Option<T>[]): Option<T[]> {
    const somes: T[] = [];
    const nones: None<T>[] = [];

    for (const item of options) {
      if (item.isSome()) {
        somes.push(item.value);
      } else if (item.isNone()) {
        nones.push(item);
      }
    }

    if (nones.length > 0) {
      return OptionUtil.None();
    }
    return OptionUtil.Some(somes);
  },

  any<T>(options: Option<T>[]): Some<T[]> {
    const somes: T[] = [];

    for (const item of options) {
      if (item.isSome()) {
        somes.push(item.value);
      }
    }

    return OptionUtil.Some(somes);
  },
};
