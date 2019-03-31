import { http } from "../../../utils/http";
import { UserPermissionMap } from "../../../components/ChangePermissionPopup/cpp-api";

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
    pmap: UserPermissionMap;
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


export function docRename(doc: DocInfo, newTitle: string) {
    return http.post<DocInfo>('/api/doc/update', {
        ...doc, 
        title: newTitle
    });
}
