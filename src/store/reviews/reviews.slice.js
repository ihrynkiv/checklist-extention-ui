import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import {thunkHandler} from "../thunkHandler";
import { reviewsService } from '../../services/Reviews.service';

export const reviewsAdapter = createEntityAdapter({
  selectId: (data) => data.prId
})



export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  () => reviewsService.fetchReviews()
)

export const createReview = createAsyncThunk(
  'reviews/createReview',
  (data, ThunkAPI) => thunkHandler(reviewsService.createReview(data), ThunkAPI)
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  (data, ThunkAPI) => thunkHandler(reviewsService.updateReview( data), ThunkAPI)
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  (prId, ThunkAPI) => thunkHandler(reviewsService.deleteReview(prId), ThunkAPI)
)

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: reviewsAdapter.getInitialState(),
  extraReducers: {
    [fetchReviews.fulfilled]: (state, {payload} ) => {
      reviewsAdapter.setAll(state, payload.data)
    },
    [createReview.fulfilled]: (state, {payload} ) => {
      reviewsAdapter.setOne(state, payload.data)
    },
    [updateReview.fulfilled]: (state, {payload}) => {
      reviewsAdapter.upsertOne(state, payload.data)
    },
    [deleteReview.fulfilled]: (state, {payload}) => {
      reviewsAdapter.removeOne(state, payload.data.prId)
    }
  }
})
