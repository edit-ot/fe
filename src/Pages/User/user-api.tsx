import { http } from "../../utils/http";
import { UserWithGroups, User } from "../../components/Login";

export function updateUserInfo(userInfo: Partial<User>) {
    return http.post<void>('/api/user/update', userInfo).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}

function getBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise(r => {
        canvas.toBlob(b => {
            r(b);
        });
    });
}

export function getUserInfo(username: string) {
    return http.get<UserWithGroups>(`/api/user/info/${ username }`).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp)
    });
}

export function uploadAvatar(fileName: string, canvas: HTMLCanvasElement) {
    return getBlob(canvas).then(blob => {
        const data = new FormData();
        // data.append('name', 'image');
        data.append('file', blob);
        data.append('fileName', fileName);

        return http.post('/api/user/avatar', data, {
            headers: { 'Content-Type' : 'multipart/form-data' }
        });
    });
}

export type UserMap = {
    [username: string]: User
}

export function toUserMap(users: User[]) {
    return users.reduce((acc, cur) => {
        acc[cur.username] = cur;
        return acc;
    }, {} as UserMap);
}

export function getFollowers(who: string) {
    return http.get$<User[]>('/api/user/followers', {
        username: who
    })
}

export function getFollowings(who: string) {
    return http.get$<User[]>('/api/user/followings', {
        username: who
    })
}

export function followOneRemote(who: string) {
    return http.post$<void>('/api/user/follow-one', {
        username: who
    });
}
