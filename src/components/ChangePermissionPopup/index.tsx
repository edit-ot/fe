import * as React from "react";

import "./change-permission-popup.less";
import { CreatePopupComponent } from "../../Ctx/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { searchUser, delPermissionRemote, setPermissionRemote, togglePublic } from "./cpp-api";
import { SideBtn } from "../SideBtn";
import { DocInfo } from "../../Pages/Home/Doc/doc-api";
import { loginCtx, User } from "../Login";
import { getDocById } from "../../Pages/Edit/edit-api";
import { UserLine } from "./UserLine";
import { ToggleBtn } from "../ToggleBtn";

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

export type UserPermission = {
    username: string,
    permission: RWPermission
}

export function parsePermissionStr(doc: DocInfo): UserPermission[] {
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

export type ChangePermissionPopupProps = CreatePopupComponent<{
    docId: number
}>

export function ChangePermissionPopup(props: ChangePermissionPopupProps) {
    const [doc, setDoc] = React.useState(null as DocInfo | null);

    React.useEffect(() => {
        getDocById(props.docId).then(setDoc);
    }, []);

    const { user } = React.useContext(loginCtx);

    const [searchMode, setSearchMode] = React.useState(false);

    const [userList, setUserList] = React.useState([] as User[]);

    

    const $input = React.useRef<HTMLInputElement>();

    const onChange = e => {
        const { value } = $input.current;

        setSearchMode(!!value);

        $input.current.value &&
            searchUser($input.current.value).then(
                users => Promise.resolve(
                    users.filter($ => $.username !== user.username)
                )
            ).then(setUserList).catch(console.error);
    }

    const delPermission = (theUsername: string) => {
        const newDoc = { ...doc };
        delete newDoc.pmap[theUsername];
        setDoc(newDoc);

        delPermissionRemote(props.docId, theUsername);
    }

    const setPermission = (theUsername: string, rw: RWPermission) => {
        const newDoc = { ...doc };
        newDoc.pmap[theUsername] = rw;
        setDoc(newDoc);

        setPermissionRemote(props.docId, theUsername, rw);
    }

    const tooglePublic = () => {
        const newDoc = { ...doc };
        newDoc.isPublic = !doc.isPublic;
        setDoc(newDoc);

        togglePublic(props.docId);
    }
    
    return (
        <div className="change-permission-popup-main">
            <h1>
                { searchMode ? '搜索并添加...' : '修改权限' }
                <span className="_icon" onClick={ () => {
                    // @ts-ignore
                    window.props = props;
                    console.log('!!!!', props);
                    props.pop()
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

            { !doc && <div>Loading ...</div> }

            {searchMode && doc && 
                <div className="_now-permission">{
                    userList.map((user, idx) => {
                        // <UserLine></UserLine>
                        return (
                            <UserLine avatar={ `/api/user/avatar/${ user.username }` }
                                key={ idx }
                                username={ user.username }>
                                { doc.pmap[user.username] ? (
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
                }</div>
            }

            { 
                !searchMode && doc && 
                <div className="_now-permission">
                    {user && (
                        <UserLine avatar={ `/api/user/avatar/${ user.username }` } 
                            username={ user.username }>
                            <div>
                                <SideBtn slides={[]}>
                                    <div className="_btn _disable"
                                        style={{ textAlign: 'center', width: '100%' }}>
                                        所有者
                                    </div>
                                </SideBtn>
                            </div>
                        </UserLine>
                    )}
                    
                    {
                        Object.keys(doc.pmap).filter(u => u !== '*').map((otherUser, idx) => {
                            return <UserLine avatar={ `/api/user/avatar/${ otherUser }` }
                                key={ idx }
                                username={ otherUser }>
                                <SideBtn slides={[
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
                                ]}>
                                    <div className="_btn" style={{ textAlign: 'center', width: '100%' }}>
                                        { RWToString(doc.pmap[otherUser]) } <FontAwesomeIcon icon={ faCaretDown } />
                                    </div>
                                </SideBtn>
                            </UserLine>
                        })
                    }
                </div> 
            }


            {!searchMode && doc && (
                <div className="_pub-share">
                    <h1>公开分享</h1>
                    {
                        <div>
                            <div>
                                <ToggleBtn active={ doc.isPublic }
                                    onClick={ tooglePublic }/>
                            </div>
                            <span>
                                开启公共分享
                            </span>

                            { doc.isPublic && (
                                <SideBtn slides={[{
                                    name: '设为只读',
                                    onBtnClick: () => setPermission('*', { r: true })
                                }, {
                                    name: '可读可写',
                                    onBtnClick: () => setPermission('*', { r: true, w: true })
                                }]}>
                                    <div className="_btn" style={{ textAlign: 'center', width: '100%' }}>
                                        { RWToString(doc.pmap['*'] || { r: true }) } <FontAwesomeIcon icon={ faCaretDown } />
                                    </div>
                                </SideBtn>
                            ) }
                        </div>
                    }
                </div>
            )}
            
        </div>
    )
}
