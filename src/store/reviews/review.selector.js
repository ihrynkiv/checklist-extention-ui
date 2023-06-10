import {createSelector} from "@reduxjs/toolkit";
import { reviewsAdapter } from './reviews.slice';

const getAll = (state) => state.reviews

export const getReviews = createSelector(
  getAll,
  (reviews) => reviews?.data || []
)

export const getReviewById = createSelector(
  getReviews,
  (_, id) => id,
  (reviews, id) => reviews.find((review) => review.id === id) || {}
)

export const {selectAll: selectReviews, selectById: selectReviewById} = reviewsAdapter.getSelectors((state) => state.reviews)
