import { http } from "../../utils/http";

export type OriginMsg<Type, T> = {
    msgId: string;
    to: string;
    content: string;
    isRead: boolean;
    createAt: Date;

    type: Type;
    jsonData: T;
}

export type NotificationItem = {
    text: string;
    url?: string;
}

export type ReqBody = {
    state: 'pendding' | 'resolved' | 'rejected';
    resUrl: string;
    rejUrl: string;

    resMsg: string;
    rejMsg: string;
}


export type Msg = 
    OriginMsg<'notification', NotificationItem> | 
    OriginMsg<'request', ReqBody>


export function getAllMsgs(): Promise< Msg[] > {
    return http.get$<Msg[]>('/api/msg').then(msgs => {
        return msgs.map(m => {
            return {
                ...m,
                jsonData: typeof m.jsonData === 'string' ?
                    JSON.parse(m.jsonData) : m.jsonData,
                createAt: new Date(m.createAt)
            }
        });
    });
}

export function remoteMsgRemote(msgId: string) {
    return http.post$('/api/msg/remove', {
        msgId
    });
}

export function resolveReqRemote(reqId: string) {
    return http.post$('/api/req/resolve', { reqId });
}

export function rejectReqRemote(reqId: string) {
    return http.post$('/api/req/reject', { reqId });
}

export function rejectRej() {
    
}

export function setReadRemote(msg: Msg) {
    return http.post$<void>('/api/msg/has-been-read', msg);
}
