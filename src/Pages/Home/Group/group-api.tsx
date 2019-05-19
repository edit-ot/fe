import { http } from "../../../utils/http";
import { User } from "../../../components/Login";
import { RWDescriptorBase, RWDescriptorToString } from "../../../utils/RWDescriptor";
import { Group } from "../homeaside-api";

export function createDocForGroup(groupId: string) {
    return http.post<void>('/api/doc/create-for-gorup', {
        groupId
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(true) : 
            Promise.reject(resp);
    });
}

export function cancelShare(docId: number, groupId: string) {
    console.log('cancel share 还没做');
}

export function setPermissionRemote(groupId: string, username: string, RW?: RWDescriptorBase) {
    return http.post<boolean>('/api/group/set-permission', {
        groupId, username, set: RW ? RWDescriptorToString(RW) : undefined
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp)
    })
}

export function sendGroupPermissionReq(groupId: string) {
    return http.post$('/api/req/group-permission-req', {
        groupId
    });
}


// export function getGroupUsers(groupId: string) {
//     return http.get<User[]>('/api/group/user', {
//         groupId
//     }).then(resp => {
//         return resp.code === 200 && resp.data ? 
//             Promise.resolve(resp.data) : 
//             Promise.reject(resp);
//     })
// }
