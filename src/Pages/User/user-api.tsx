import { http } from "../../utils/http";
import { User } from "../../components/Login";

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

export function uploadAvatar(canvas: HTMLCanvasElement) {
    return getBlob(canvas).then(blob => {
        const data = new FormData();
        // data.append('name', 'image');
        data.append('file', blob);

        return http.post('/api/user/avatar', data, {
            headers: { 'Content-Type' : 'multipart/form-data' }
        });
    });
}
