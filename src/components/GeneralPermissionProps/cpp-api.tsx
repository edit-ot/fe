import { http } from "../../utils/http";
import { User } from "../Login";
import { DocInfo } from "../../Pages/Home/Doc/doc-api";

export type RWDescriptor = {
    r: boolean,
    w?: boolean
}

export type UserPermissionMap = {
    [key: string]: RWDescriptor
}

export function searchUser(keyword: string) {
    return http.get<User[]>('/api/user/search', {
        keyword
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}

export function delPermissionRemote(docId: number, username: string) {
    return http.post('/api/doc/permission', {
        docId,
        username,
        set: ''
    });
}

export function setPermissionRemote(docId: number, username: string, RW: RWDescriptor) {
    return http.post('/api/doc/permission', {
        docId,
        username,
        set: RW
    });
}

export function togglePublic(docId: number) {
    return http.post('/api/doc/permission/toggle', {
        docId
    });
}

export function mapDocToPubLink(doc: DocInfo) {
    return `${ window.location.origin }/edit/${ doc.id }`;
}
