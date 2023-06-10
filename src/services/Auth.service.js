import api from "./http/axios.instanse";

export const AuthService = {
    login: async (data) => api.post('/auth/login', data),
    registration: async (data) => api.post('/auth/registration', data),
    update: async (data) => api.put('/auth/', data),
}
