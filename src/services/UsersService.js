import api from "./http/axios.instanse";

export const UsersService = {
    fetchUserNames: async () => api.get('/users/userNames'),
    whoAmI: async () => api.get('/users/whoami'),
    updateUserConfiguration: async (data) => api.put('/users', data)
}
