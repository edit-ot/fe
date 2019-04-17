export interface RWDescriptorBase {
    r: boolean,
    w?: boolean
}

export type UserPermissionMap = {
    [key: string]: RWDescriptorBase
}

export function RWDescriptorToString(rw: RWDescriptorBase) {
    let permission = '';
    
    if (rw.r) permission += 'r';
    if (rw.w) permission += 'w';

    return permission;
}

export function parse2RWDescriptor(permissionStr: string): RWDescriptorBase {
    return (permissionStr || 'r').split('').reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
    }, {} as RWDescriptorBase);
}


export function toPermissionObj(permission: string): UserPermissionMap {
    if (!permission) return {};

    return permission.split(',').reduce((acc, userLine) => {
        const [username, rw] = userLine.split('|');

        acc[username] =  (rw || 'rw').split('').reduce((acc, cur) => {
            acc[cur] = true;
            return acc;
        }, {} as RWDescriptorBase);

        return acc; 
    }, {} as UserPermissionMap);
}

export function pmapToStr(p: UserPermissionMap) {
    return Object.keys(p).map(username => {
        const rwd = p[username];
        let permission = '';
        
        if (rwd.r) permission += 'r';
        if (rwd.w) permission += 'w';
        
        return `${ username }|${ permission }`
    }).join(',');
}
