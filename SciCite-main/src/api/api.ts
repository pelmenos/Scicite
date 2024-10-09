import axios from "axios";
import i18next from "i18next";

export const instance = axios.create({
    baseURL: "https://scisource.ru/api/v1/",
    withCredentials: true,
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    config.headers['Accept-Language'] = i18next.language
    return config
})

export type TResponse<D = {}, RC = boolean> = {
    success: RC
    data: D
}

export type TResponseWithResults<D = {}> = {
    count: number
    next: string
    previous: string
    results: D[]
}