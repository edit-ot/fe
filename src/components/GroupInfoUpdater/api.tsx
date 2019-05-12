import { http } from "../../utils/http";
import { Group } from "../../Pages/Home/homeaside-api";


function getBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise(r => {
        canvas.toBlob(b => {
            r(b);
        });
    });
}

export type FileItem = {
    fileId: string;
    URL: string;
    owner: string;
}

export function uploadAnImage(canvas: HTMLCanvasElement) {
    return getBlob(canvas).then(blob => {
        const data = new FormData();
        data.append('file', blob);

        return http.post<FileItem>('/api/user/upload-file', data, {
            headers: { 'Content-Type' : 'multipart/form-data' }
        }).then(resp => {
            return resp.code === 200 ? 
                Promise.resolve(resp.data) : 
                Promise.reject(resp);
        });
    });
}

export async function updateGroupInfo(groupId: string, groupName: string, groupIntro: string, newImg?: HTMLCanvasElement | null) {
    let groupAvatar;

    if (newImg) {
        const f = await uploadAnImage(newImg);
        groupAvatar = f.URL;
    }
    
    return http.post<Group>('/api/group/update-all', {
        groupId,
        groupName,
        groupIntro, 
        groupAvatar
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    })
}

