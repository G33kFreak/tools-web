import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
}, (error) => {
    Promise.reject(error)
})

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = localStorage.getItem('refreshToken')
            return axiosClient
                .post('/tokens/refresh', {
                    refresh_token: refreshToken
                })
                .then((res) => {
                    if (res.status === 200) {
                        localStorage.setItem('refreshToken', res.data['refresh_token'])
                        localStorage.setItem('accessToken', res.data['access_token'])
                        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data['access_token']}`
                        return axiosClient(originalRequest)
                    }
                })
        }

        return Promise.reject(error)
    }
)

export default axiosClient

