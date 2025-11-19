import axios, {type AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = '/api/v1';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерсептор для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;