import { http } from "../../../utils/http";
import { UserPermissionMap } from "../../../components/ChangePermissionPopup/cpp-api";
import { getGroups, getJoinedGroups } from "../homeaside-api";

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
    isPublic: boolean;
}

export type DocInfoWithPmap = DocInfo & {
    pmap: UserPermissionMap
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

export function getAllGroup() {
    return Promise.all([
        getGroups(), getJoinedGroups()
    ]).then(results => {
        const [l, r] = results;
        return l.concat(r);
    });
}
