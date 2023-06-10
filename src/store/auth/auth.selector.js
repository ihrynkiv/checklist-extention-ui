import {createSelector} from "@reduxjs/toolkit";

export const getAuth = (state) => state.auth

export const getCurrentUsername = createSelector(
  getAuth,
  (auth) => auth?.username
)
