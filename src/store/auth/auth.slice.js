import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AuthService} from "../../services/Auth.service";
import {UsersService} from "../../services/UsersService";
import {thunkHandler} from "../thunkHandler";

export const loginAction = createAsyncThunk(
  'auth/login',
  (data) => AuthService.login(data)
)

export const registrationAction = createAsyncThunk(
  'auth/registration',
  (data) => AuthService.registration(data)
)

export const whoAmIAction = createAsyncThunk(
  'auth/whoAmI',
  () => UsersService.whoAmI()
)

export const updatePasswordAction = createAsyncThunk(
  'auth/updatePassword',
  (data, ThunkAPI) => thunkHandler(AuthService.update(data), ThunkAPI)
)

export const updateUserConfiguration = createAsyncThunk(
  'auth/updateUserConfiguration',
  (data, ThunkAPI) => thunkHandler(UsersService.updateUserConfiguration(data), ThunkAPI)
)

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    isAuth: false,
    data: {}
  },
  extraReducers: {
    [loginAction.fulfilled]: (state, {meta, payload} ) => {
      localStorage.setItem('token', payload.data)
      localStorage.setItem('username', payload.data.username)
      state.isAuth = true
      state.username = meta.arg.username
    },
    [registrationAction.fulfilled]: (state, {meta, payload} ) => {
      localStorage.setItem('token', payload.data)
      localStorage.setItem('username', payload.data.username)
      state.isAuth = true
      state.username = meta.arg.username
    },
    [whoAmIAction.fulfilled]: (state, {payload}) => {
      localStorage.setItem('username', payload.data.username)
      state.isAuth = true
      state.username = payload.data.username
      state.data = payload.data
    },
    [updateUserConfiguration.fulfilled]: (state, {payload}) => {
      state.data = payload.data
    }
  }
})
