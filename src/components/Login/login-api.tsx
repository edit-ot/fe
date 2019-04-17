import { http } from "../../utils/http";

export type InputData = {
    [key: string]: string
}

export type User = {
    username: string;
    avatar: string;
    nickname: string;
}

export function doLogin(data: InputData) {
    return http.post<User>('/api/user/login', data);
}

export function doLogoutRemote() {
    return http.get<void>('/api/user/logout');
}

export function doRegister(data: InputData) {
    return http.post<User>('/api/user/register', data);
}

export function getUserInfo() {
    return http.get<User>('/api/user/me');
}
