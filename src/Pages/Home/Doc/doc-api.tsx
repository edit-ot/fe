import { http } from "../../../utils/http";

export type InputData = {
    [key: string]: string
}

export type DocInfo = {
    id: number;
    content: string;
    title: string;
    owner: string;
    permission: string;
    createAt: string;
    updateAt: string;
}

export function getDoc() {
    return http.get<DocInfo[]>('/api/doc').then(resp => {
        if (resp.code === 200) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    }).catch(console.error);
}

export function createBlankDoc() {
    return http.post<DocInfo>('/api/doc/create');
}

export function deleteDoc(data: DocInfo) {
    return http.post<DocInfo | null>('/api/doc/delete', {
        docId: data.id
    });
}
