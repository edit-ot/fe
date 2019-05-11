import { http } from "../../../utils/http";
import { UserPermissionMap } from "../../../components/ChangePermissionPopup/cpp-api";
import { getGroups, getJoinedGroups } from "../homeaside-api";
import { popup$ } from "../../../Ctx/Popup";
import { GetInputPopup } from "../../../components/GetInputPopup";

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

export function getDoc(relatedDocs?: boolean): Promise<DocInfo[]> {
    return http.get<DocInfo[]>('/api/doc', {
        relatedDocs
    }).then(resp => {
        return resp.code === 200 ?
            Promise.resolve(resp.data || []) : 
            Promise.reject(resp);
    });
}

export function cancelOthersShare(docId: number | string) {
    return http.post<any>('/api/doc/permission/cancel-share', {
        docId
    }).then(resp => {
        return resp.code === 200 ?
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
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

export const toDeleteMyDoc = (doc: DocInfo) => {
    return new Promise((resolve, reject) => {
        popup$.push(GetInputPopup, {
            title: `删除 '${ doc.title }' ?`,
            confrimText: '删除',
            cancelText: '取消',
            pureConfirm: true,
            onConfirm() {
                deleteDoc(doc).then(resp => {
                    if (resp.code === 200 && resp.data) {
                        resolve();
                    } else {
                        console.log('删除失败', resp);
                        reject();
                    }
                }).catch(console.error);
            }
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        })
    });
}

export const toRenameMyDoc = (doc: DocInfo) => {
    return new Promise((resolve, reject) => {
        popup$.push(GetInputPopup, {
            title: '修改文件名',
            onConfirm: input => {
                docRename(doc, input).then(resp => {
                    if (resp.code === 200 && resp.data) {
                        resolve();
                    } else {
                        reject(resp);
                        console.error(resp);
                    }
                })
            },
            checker: str => !!str,
            errorInfo: '文件名请勿为空'
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        });
    });
}

export const toUnlinkDoc = (doc: DocInfo) => {
    return new Promise((resolve, reject) => {
        popup$.push(GetInputPopup, {
            title: `退出分享 ?`,
            confrimText: '确定',
            cancelText: '取消',
            introText: <span>你不是文档所有者 <br /> 退出这个文档的分享并不会删除此文档</span>,
            pureConfirm: true,
            onConfirm() {
                cancelOthersShare(doc.id).then(resolve);
            }
        }, {
            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
        })
    });
}
