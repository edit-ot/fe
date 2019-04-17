import { http } from "../../../utils/http";

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
    
}
