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
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            deleteToken();
            queryClient.clear();
            window.location.replace("/login")
        }

        return Promise.reject(error);
    }
);

export const getWithoutCache = (url: string, config = {}) => {
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;
    return api.get(urlWithTimestamp, config);
};


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        deleteToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        throw new Error('Request failed');
    }

    return response.json();
};