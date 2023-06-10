import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UsersService} from "../../services/UsersService";

export const fetchUserNames = createAsyncThunk(
  'users/fetchUserNames',
  () => UsersService.fetchUserNames()
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userNames: []
  },
  extraReducers: {
    [fetchUserNames.fulfilled]: (state, {payload} ) => {
      state.userNames = payload.data
    }
  }
})
