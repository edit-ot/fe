import * as React from "react";

import "./change-permission-popup.less";
import { CreatePopupComponent, popupCtx } from "../../Ctx/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCaretDown, faCopy, faCheckCircle, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { searchUser, delPermissionRemote, setPermissionRemote, togglePublic, mapDocToPubLink } from "./cpp-api";
import { SideBtn } from "../SideBtn";
import { DocInfo } from "../../Pages/Home/Doc/doc-api";
import { loginCtx, User } from "../Login";
import { getDocById } from "../../Pages/Edit/edit-api";
import { UserLine } from "./UserLine";
import { ToggleBtn } from "../ToggleBtn";
import { MenuBtns } from "../MenuBtns";
import { throttle, debounce } from "../../utils";
import { copyTextToClipboard } from "../../utils/copyToClipboard";
import { QRCode } from "./QRCode";

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
    const [copySuccess, setCopySuccess] = React.useState(false);

    const _popupCtx = React.useContext(popupCtx);

    React.useEffect(() => {
        getDocById(props.docId).then(setDoc);
    }, []);

    const { user } = React.useContext(loginCtx);

    const [searchMode, setSearchMode] = React.useState(false);

    const [userList, setUserList] = React.useState([] as User[]);

    const $input = React.useRef<HTMLInputElement>();

    
    const onChange = debounce(() => {
        const { value } = $input.current;

        setSearchMode(!!value);

        $input.current.value &&
            searchUser($input.current.value).then(
                users => Promise.resolve(
                    users.filter($ => $.username !== user.username)
                )
            ).then(setUserList).catch(console.error);
    });

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

            { !doc && <div>Loading ...</div> }

            {searchMode && doc && 
                <div className="_now-permission">{
                    userList.length ? (
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
                    ) : (
                        <div style={{ textAlign: 'center', color: '#BBB' }}>查无此人</div>
                    )
                }</div>
            }

            { 
                !searchMode && doc && 
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
                        Object.keys(doc.pmap).filter(u => u !== '*').map((otherUser, idx) => {
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
                                            { RWToString(doc.pmap[otherUser]) } <FontAwesomeIcon icon={ faCaretDown } />
                                        </div>
                                }</MenuBtns>
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
                                <MenuBtns slides={[{
                                    name: '设为只读',
                                    onBtnClick: () => setPermission('*', { r: true })
                                }, {
                                    name: '可读可写',
                                    onBtnClick: () => setPermission('*', { r: true, w: true })
                                }]}>{
                                    ref => 
                                        <div className="_btn"
                                            style={{ textAlign: 'center' }}
                                            ref={ ref }>
                                            { RWToString(doc.pmap['*'] || { r: true }) } <FontAwesomeIcon icon={ faCaretDown } />
                                        </div>
                                }</MenuBtns>
                            ) }
                        </div>
                    }
                </div>
            )}

            { !searchMode && doc && doc.isPublic && (
                <div className="_pub-link">
                    <div className="_text">
                        { mapDocToPubLink(doc) }
                    </div>

                    <div className="_copy-btn" onClick={ () => {
                        copyTextToClipboard(mapDocToPubLink(doc));
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2500);
                    }}>
                        {
                            copySuccess ? (
                                <FontAwesomeIcon style={{ color: 'rgb(67, 188, 123)' }}
                                    icon={ faCheckCircle } />
                            ) : (
                                <FontAwesomeIcon icon={ faCopy } />
                            )
                        }
                    </div>

                    <div className="_copy-btn" onClick={ () => {
                        _popupCtx.push(QRCode, {
                            text: mapDocToPubLink(doc)
                        }, {
                            style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                        })
                    }}>
                        <FontAwesomeIcon icon={ faQrcode } />
                    </div>
                </div>
            )}
            
        </div>
    )
}
