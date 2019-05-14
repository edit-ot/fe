import { http } from "../../utils/http";

export type Punch = {
    date: string;
    groupId: string;
    nDayBefore: number;
    username: string;
}

export function getPunchInfo(username: string, groupId: string) {
    return http.get<Punch[]>('/api/punch', {
        username, groupId
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}


export type DateMap = { [dateStr: string]: boolean };

export function getKeyFromDate(d: Date) {
    return `${d.getFullYear()}-${ d.getMonth() + 1 }-${ d.getDate() }`;
}

export function punchesToMap(punches$: Punch[]): DateMap {
    return punches$.reduce((acc, p) => {
        acc[getKeyFromDate(new Date(p.date))] = true;
        return acc;
    }, {} as DateMap);
}

export function toPunchRemote(groupId: string) {
    return http.post<void>('/api/punch', {
        groupId
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}

export type PunchPKUserInfo = {
    username: string, 
    avatar: string,
    n: number
}

export function getGroupPunchPK(groupId: string) {
    return http.get<PunchPKUserInfo[]>('/api/punch/all', {
        groupId
    }).then(resp => {
        return resp.code === 200 ? 
            Promise.resolve(resp.data) : 
            Promise.reject(resp);
    });
}
