import axios from "axios";
import { QueryClient } from '@tanstack/react-query';
import { deleteToken, getToken } from "../utils/cookies";
export const queryClient = new QueryClient();
export const api = axios.create({
    baseURL: '',
});

api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === 'get') {
        const timestamp = new Date().getTime();
        const separator = config.url?.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_t=${timestamp}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (!error.response) {
            error.message = "اتصال به سرور برقرار نشد";
            return Promise.reject(error);
        }

        const status = error.response.status;

        if (status === 401) {
            deleteToken();
            queryClient.clear();
            window.location.replace("/login");
            return Promise.reject(error);
        }

        let message = error.response?.data?.message || error.response?.data?.error;

        if (!message) {
            if (status === 400) {
                message = "اطلاعات ارسالی صحیح نیست یا فرم ناقص است";
            } else if (status === 403) {
                message = "شما اجازه انجام این عملیات را ندارید";
            } else if (status === 404) {
                message = "مورد مورد نظر یافت نشد";
            } else if (status >= 500) {
                message = "خطای سرور – لطفاً بعداً امتحان کنید";
            } else {
                message = `خطا (${status})`;
            }
        }

        error.message = message;

        console.error(`API Error ${status}:`, error.response?.data || error.message);

        return Promise.reject(error);
    }
);

export const getWithoutCache = (url: string, config = {}) => {
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;
    return api.get(urlWithTimestamp, config);
};


