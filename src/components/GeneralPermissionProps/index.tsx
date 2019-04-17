import * as React from "react";

import "./change-permission-popup.less";
import { CreatePopupComponent, popupCtx } from "../../Ctx/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCaretDown, faCopy, faCheckCircle, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { loginCtx, User } from "../Login";

import { UserLine } from "./UserLine";
import { ToggleBtn } from "../ToggleBtn";
import { MenuBtns } from "../MenuBtns";
import { debounce } from "../../utils";
import { copyTextToClipboard } from "../../utils/copyToClipboard";
import { QRCode } from "./QRCode";
import { UserPermissionMap, RWDescriptorBase } from "../../utils/RWDescriptor";

export type RWPermission = {
    r: boolean,
    w?: boolean
}

export function RWToString(rw: RWPermission) {
    if (rw.r) {
        return rw.w ? 
            '可读可写' : '只读'
    } else {
        return '无权限';
    }
}

export interface HasPermission {
    pmap: UserPermissionMap, 
    permission: string
}

export type UserPermission = {
    username: string,
    permission: RWPermission
}

export function parsePermissionStr(doc: HasPermission): UserPermission[] {
    if (!doc.permission) return [];

    const lines = (doc.permission).split(', ');

    return lines.map(line => {
        const [username, permission] = line.split('|');

        return {
            username,
            permission: (permission).split('').reduce((acc, cur) => {
                acc[cur] = true;
                return acc;
            }, {} as RWPermission)
        }
    });
}

export type GeneralPermissionProps<T> = CreatePopupComponent<{
    getData: () => Promise<T>,
    searchUser: (keyword: string) => Promise<User[]>,
    delPermission: (data: T, username: string) => any,
    setPermission: (data: T, username: string, rw: RWDescriptorBase) => any,
    title?: string | any
}>

export function GeneralPermission<T extends HasPermission>
    (props: GeneralPermissionProps<T>) {
    
    const [data, setData] = React.useState(null as T | null);

    

    React.useEffect(() => {
        props.getData().then(setData);
    }, []);

    const { user } = React.useContext(loginCtx);

    const [searchMode, setSearchMode] = React.useState(false);

    const [userList, setUserList] = React.useState([] as User[]);

    const $input = React.useRef<HTMLInputElement>();

    
    const onChange = debounce(() => {
        const { value } = $input.current;

        setSearchMode(!!value);

        $input.current.value &&
            props.searchUser($input.current.value).then(
                users => Promise.resolve(
                    users.filter($ => $.username !== user.username)
                )
            ).then(setUserList).catch(console.error);
    });

    const delPermission = (theUsername: string) => {
        const newData = { ...data };
        delete newData.pmap[theUsername];
        setData(newData);

        props.delPermission(newData, theUsername);
    }

    const setPermission = (theUsername: string, rw: RWPermission) => {
        console.log('setPermission', theUsername, rw);

        const newData = { ...data };
        newData.pmap[theUsername] = rw;
        setData(newData);

        props.setPermission(newData, theUsername, rw);
    }


    
    return (
        <div className="change-permission-popup-main">
            <h1>
                { searchMode ? '搜索并添加...' : props.title || '修改权限' }
                <span className="_icon" onClick={ () => {
                    if (searchMode) {
                        setSearchMode(false);
                    } else {
                        props.pop();
                    }
                } }>
                    <FontAwesomeIcon icon={ faTimes } />
                </span>
            </h1>

            <div className="std-input">
                <span className="_search-icon">
                    <FontAwesomeIcon icon={ faSearch } />
                </span>
                <input ref={ $input } placeholder="搜索用户名" onChange={ onChange } />
            </div>

            { !data && <div>Loading ...</div> }

            {searchMode && data && 
                <div className="_now-permission">{
                    userList.length ? (
                        userList.map((user, idx) => {
                            // <UserLine></UserLine>
                            return (
                                <UserLine avatar={ `/api/user/avatar/${ user.username }` }
                                    key={ idx }
                                    username={ user.username }>
                                    { data.pmap[user.username] ? (
                                        <div className="_btn _disable"
                                            onClick={() => delPermission(user.username)}>
                                            已添加</div>
                                    ) : (
                                        <div className="_btn"
                                            onClick={() => setPermission(user.username, { r: true })}>
                                            添加</div>
                                    )}
                                </UserLine>
                            )
                        })
                    ) : (
                        <div style={{ textAlign: 'center', color: '#BBB' }}>查无此人</div>
                    )
                }</div>
            }

            { 
                !searchMode && data && 
                <div className="_now-permission">
                    {user && (
                        <UserLine avatar={ `/api/user/avatar/${ user.username }` } 
                            username={ user.username }>
                            <div>
                                <div className="_btn _disable"
                                    style={{ textAlign: 'center', width: '100%' }}>
                                    所有者
                                </div>
                            </div>
                        </UserLine>
                    )}
                    
                    {
                        Object.keys(data.pmap).filter(u => u !== '*').map((otherUser, idx) => {
                            return <UserLine avatar={ `/api/user/avatar/${ otherUser }` }
                                key={ idx }
                                username={ otherUser }>

                                <MenuBtns slides={[
                                    {
                                        name: '设为只读',
                                        onBtnClick: () => setPermission(otherUser, { r: true })
                                    },
                                    {
                                        name: '可读可写',
                                        onBtnClick: () => setPermission(otherUser, { r: true, w: true })
                                    },
                                    {
                                        name: '移除',
                                        onBtnClick: () => delPermission(otherUser)
                                    }
                                ]}>{
                                    ref =>
                                        <div className="_btn"
                                            // style={{ textAlign: 'center', width: '100%' }}
                                            ref={ ref }>
                                            { RWToString(data.pmap[otherUser]) } <FontAwesomeIcon icon={ faCaretDown } />
                                        </div>
                                }</MenuBtns>
                            </UserLine>
                        })
                    }
                </div> 
            }

        </div>
    )
}
