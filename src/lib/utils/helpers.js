export function withThunk(dispatch) {
  return actionOrThunk =>
    typeof actionOrThunk === "function"
      ? actionOrThunk(dispatch)
      : dispatch(actionOrThunk);
}

export function debounce(fn, wait, ctx) {
  let timer;

  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(ctx, args);
      timer = null;
    }, wait);
  };
}