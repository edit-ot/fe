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
    type: string;
    cratedAt: Date;
    fileName: string;
    size: number;
}

export function uploadAnImage(fileName: string, canvas: HTMLCanvasElement) {
    return getBlob(canvas).then(blob => {
        const data = new FormData();
        data.append('file', blob);
        data.append('fileName', fileName);

        return http.post<FileItem>('/api/user/upload-file', data, {
            headers: { 'Content-Type' : 'multipart/form-data' }
        }).then(resp => {
            return resp.code === 200 ? 
                Promise.resolve(resp.data) : 
                Promise.reject(resp);
        });
    });
}

export async function updateGroupInfo(
    groupId: string,
    groupName: string,
    groupIntro: string,
    fileName: string,
    newImg?: HTMLCanvasElement | null
) {
    let groupAvatar;

    if (newImg) {
        const f = await uploadAnImage(fileName, newImg);
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
    });
}

export function useTextAvatarRemote(groupId: string) {
    return http.post<void>('/api/group/update-all', {
        groupId,
        groupAvatar: 'remove'
    });
}
