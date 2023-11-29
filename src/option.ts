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

/**
  * The Option class is a wrapper around the Some and None classes.
  *
  * It's a helper/utility for other use cases where you want to operate on an array of Options.
  *
  * @example A database operation that returns an Option
  * ```typescript
  * function getUser(id: string): Promise<Option<User>> {
  *   const user = await db.get(id);
  *   if (user) {
  *     return Option.Some(user);
  *   }
  *   return Option.None();
  * }
  *
  * */
export const Option = {
  /**
    * Constructs an Option of "Some", a successful value.
    *
    * @params value: The value to be wrapped in an Option
    * @returns A Some<T> object
    *
    * */
  Some,

  /**
    * Constructs an Option of "None", a failed/null value.
    *
    * @params value: The value to be wrapped in an Option
    * @returns A None<T> object
    *
    * */
  None,

  /**
    * Returns an option of all array values if all of them are Some.
    * If any of them is None, it returns None.
    *
    * @params options: An array of options
    * @returns An option of an array of all the values if all of them are Some.
    *
    * @example One none in the array of options
    * ```typescript
    * const opts: Option<string> = [Some("Foo"), Some("Bar"), None()]
    * Option.all(opts) // None()
    * ```
    * @example No none in the array of options
    * ```typescript
    * const opts: Option<string> = [Some("Foo"), Some("Bar")]
    * Option.all(opts) // Some(["Foo", "Bar"])
    * ```
    * */
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
      return Option.None();
    }
    return Option.Some(somes);
  },

  /**
    * Returns an Option of an array of all the Some values.
    * It basically filters out all the None values.
    * Therefore, it might return an empty array.
    *
    * @params options: An array of options
    * @returns An option of an array of all the values if any of them are Some.
    *
    * @example Option array into a single Option as string array
    * ```typescript
    * const opts: Option<string> = [None(), Some("Foo"), Some("Bar")]
    * Option.any(opts) // Some(["Foo", "Bar"])
    * ```
    *
    * */
  any<T>(options: Option<T>[]): Some<T[]> {
    const somes: T[] = [];

    for (const item of options) {
      if (item.isSome()) {
        somes.push(item.value);
      }
    }

    return Option.Some(somes);
  },
};
