import { http } from "../../utils/http";
import { Group } from "../../Pages/Home/homeaside-api";

export type InputData = {
    [key: string]: string
}

export type User = {
    username: string;
    avatar: string;
    nickname: string;
    intro: string;
}

export type UserWithGroups = User & {
    groups: Group[]
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

export function getMyInfo() {
    return http.get<User>('/api/user/me');
}
