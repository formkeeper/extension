export function withThunk(dispatch) {
  return actionOrThunk =>
   typeof actionOrThunk === "function"
     ? actionOrThunk(dispatch)
     : dispatch(actionOrThunk)
}