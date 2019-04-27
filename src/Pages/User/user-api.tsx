import { http } from "../../utils/http";
import { User } from "../../components/Login";

export function updateUserInfo(userInfo: Partial<User>) {
    return http.post<void>('/api/user/update', userInfo).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}
