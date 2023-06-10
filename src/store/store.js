import { configureStore } from '@reduxjs/toolkit'
import {authSlice} from "./auth/auth.slice";
import {usersSlice} from "./users/users.slice";
import { reviewsSlice } from './reviews/reviews.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
    reviews: reviewsSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
