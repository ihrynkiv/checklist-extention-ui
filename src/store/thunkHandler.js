export const thunkHandler = async(asyncFn, thunkAPI, meta) => {
  try {
    return thunkAPI.fulfillWithValue(await asyncFn, meta)
  } catch (error) {
    return thunkAPI.rejectWithValue(error, meta)
  }
}
