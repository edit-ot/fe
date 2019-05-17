import { http } from "../../utils/http";

export type Msg = {
    msgId: string;
    to: string;
    type: string;
    content: string;
    isRead: boolean;
    jsonData: string;
    createAt: Date;
}



export function getNotification() {
    return http.get<Msg[]>('/api/msg/notification').then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}

export function setReadRemote(msg: Msg) {
    return http.post$<void>('/api/msg/has-been-read', msg);
}



