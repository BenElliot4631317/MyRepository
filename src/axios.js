import axios from "axios";
import {localStorageService} from "@/LocalStorageService";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(config => {
    const token = localStorageService.getItem('auth_token');

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    } else {
        console.log('axios.js Token:', token)
    }
    return config;
}, error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(reseponse => {
    return reseponse;
}, error => {
    return Promise.reject(error);
})

export default instance;