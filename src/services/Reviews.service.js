import api from "./http/axios.instanse";

export const reviewsService = {
  fetchReviews: async () => await api.get('/reviews'),
  createReview: async (data) => await api.post('/reviews', data),
  updateReview: async (data) => await api.put(`/reviews/`, data),
  deleteReview: async (prId) => await api.delete(`/reviews/`, {data: {prId}}),
}
