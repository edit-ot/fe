import { User } from "../../components/Login";
import { http } from "../../utils/http";
import { DocInfo } from "./Doc/doc-api";
import { UserPermissionMap } from "../../utils/RWDescriptor";

export type Group = {
    // 头像 
    groupAvatar: string;

    // 名称
    groupName: string;

    // 主键
    groupId: string;

    // introdution 
    groupIntro: string;

    users: User[];

    // 所有者 id
    owner: string;

    // 所有者信息
    ownerInfo: User;

    // 所属文档
    docs?: DocInfo[];

    pmap: UserPermissionMap;

    permission: string;
}

export function getGroup(groupId: string) {
    return http.get<Group | null>(`/api/group/byId`, {
        groupId
    }).then(resp => {
        if (resp.code === 200) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    });
}

export function getGroups() {
    return http.get<Group[]>('/api/group').then(resp => {
        if (resp.code === 200 && resp.data) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    })
}

export function getJoinedGroups() {
    return http.get<Group[]>('/api/group/joined').then(resp => {
        if (resp.code === 200 && resp.data) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    })
}

export function createGroup(groupName: string) {
    return http.post<any>('/api/group', {
        groupName
    }).then(resp => {
        if (resp.code === 200) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(resp);
        }
    })
}

export function changeGroupName(groupId: string, newName: string) {
    return http.post<Group>('/api/group/name', {
        groupId, groupName: newName
    }).then(resp => {
        if (resp.code === 200) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    })
}

export function deleteGroup(groupId: string) {
    return http.post<Group>('/api/group/delete', {
        groupId
    }).then(resp => {
        if (resp.code === 200) {
            return Promise.resolve(resp.data);
        } else {
            return Promise.reject(resp);
        }
    })
}

export function linkDocGroup(docId: number, groupId: string) {
    return http.post('/api/group/doc-link-group', {
        docId, groupId
    }).then(resp => {
        return resp.code === 200 ?
            Promise.resolve(true) : 
            Promise.reject(resp);
    })
}

export function unLinkDocGroup(docId: number, groupId: string) {
    return http.post('/api/group/doc-unlink-group', {
        docId, groupId
    }).then(resp => {
        return resp.code === 200 ?
            Promise.resolve(true) : 
            Promise.reject(resp);
    });
}
