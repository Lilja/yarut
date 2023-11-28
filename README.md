# yarut - Yet Another Result Utility for Typescript

A result/option utility for typescript.

```typescript
import { Result, Ok, Err } from "yarut";

const apiCall = (): Result<string, Error> => {
    return ResultUtil.Ok("All good!");
}
const result = apiCall();

// With help of these type guards, either `value` or `error` is available
if (result.isOk()) {
    console.log("It works!", result.value);
} else {
    console.log("Oh no :(", result.error);
}

```

## Features
* `Result` - Encode errors as type information and explicitly handle them
* `Option` - Don't use null/undefined to express values that doesn't exist. Use `None` and `Some` to indicate it.

## Acknowledgements
Inspired by the work of [@swan-io/boxed](https://github.com/swan-io/boxed)
