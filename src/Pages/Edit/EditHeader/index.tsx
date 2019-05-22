import * as React from "react";
import { User, loginCtx } from "../../../components/Login";

import "./edit-header.less";
import { HoverInfo } from "../../../components/HoverHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink } from "@fortawesome/free-solid-svg-icons";
import EventEmitter from "eventemitter3";
import { popupCtx } from "../../../Ctx/Popup";
import { ChangePermissionPopup } from "../../../components/ChangePermissionPopup";
import { DocInfo } from "../../Home/Doc/doc-api";
import { Link } from "react-router-dom";
import { msgConnect } from "../../../utils/WS/MsgConnect";
import cls from "classnames";
import { OpenMsgWindow } from "../../../components/Msg";

export type EditHeaderCtx = {
    doc: DocInfo,
    loginedList: User[],
    setLoginedList: (users: User[]) => void,
    addLoginedList: (user: User) => void,
    removeLoginedList: (user: User) => void,

    msgs: React.ReactNode[],
    pushMsg: (component: React.ReactNode) => void,

    bus: EventEmitter,
}

export const editHeaderCtx = React.createContext<EditHeaderCtx>(null);

function Msgs(props: { msgs: React.ReactNode[] }) {
    const { msgs } = props;
    return msgs.length ? (
        <div className="msg-line">
            { msgs[msgs.length - 1] }
        </div>
    ) : null;
}

function RenderLoginedList(props: { list: User[] }) {
    const ctx = React.useContext(loginCtx);
    const editCtx = React.useContext(editHeaderCtx);
    const _popupCtx = React.useContext(popupCtx);

    const $list = props.list.filter(e => e.username !== ctx.user.username).map((e, idx) => (
        <div className="logined-user" key={ idx } onClick={ () => {
            window.open(`/user/${ e.username }`)
        }}>
            <HoverInfo info={ e.username }>
                <img src={ e.avatar } />
            </HoverInfo>
        </div>
    ));

    React.useEffect(() => {
        editCtx.bus.on('receive-hello', (theUser: User) => {
            editCtx.pushMsg(`${ theUser.username }: 大家好，我是 ${ theUser.username }`);
        });

        return () => editCtx.bus.off('receive-hello');
    }, [ editCtx ]);


    if (!ctx.user) return null;
  
    return (
        <div className="logined-list">
            { $list }

            
            <div className="logined-user _myself">
                <HoverInfo info="我自己">
                    <img src={ ctx.user.avatar } />
                </HoverInfo>
            </div>
            
            <div className="logined-user _icon" onClick={ () => {
                editCtx.bus.emit('say-hello');
            }}>
                <HoverInfo info="跟大家打个招呼">
                    <FontAwesomeIcon icon={ faGrinWink } />
                </HoverInfo>
            </div>

            { (editCtx.doc.owner === ctx.user.username) ? (
                <div className="logined-user _coo" onClick={ () => {
                    _popupCtx.push(ChangePermissionPopup, {
                        docId: editCtx.doc.id
                    }, {
                        style: { backgroundColor: 'rgba(0, 0, 0, .5)' }
                    }, () => {
                        console.log('When Pop');
                        editCtx.bus.emit('ChangePermissionPopup Popped');
                    });
                }}>
                    <HoverInfo info="协作权限管理">
                        协作
                    </HoverInfo>
                </div>
            ) : (
                <div className="logined-user _coo">
                    <HoverInfo info="只有文档所有者才能修改权限">协作</HoverInfo>
                </div>
            ) }

            <div className="logined-user _coo">
                <Link to="/">首页</Link>
            </div>

            <div className="logined-user _coo has-msg-box">
                <MsgIcon />
            </div>
            
        </div>
    )
}

function MsgIcon() {
    const [ hasUnRead, setHasUnRead ] = React.useState(false);

    React.useEffect(() => {
        msgConnect.socket.emit('msg-login');

        const $$ = data => setHasUnRead(data.hasUnRead);

        msgConnect.socket.on('msg-read-state-change', $$);

        return () => msgConnect.socket.removeListener('msg-read-state-change', $$);
    }, []);

    return <div className={ cls('msg-box', {
        'hasUnRead': hasUnRead
    }) } onClick={() => {
        setHasUnRead(false);
        OpenMsgWindow();
    }}>
        信箱
    </div>
}

export function EditHedaerProvider(props: React.PropsWithChildren<{ doc: DocInfo }>) {
    const [msgs, setMsgs] = React.useState([] as React.ReactNode[]);
    const [loginedList , ReactSetLoginedList] = React.useState([] as User[]);
    const [bus, setBus] = React.useState(new EventEmitter() as EventEmitter);

    const setLoginedList = (users: User[]) => {
        console.log('setLoginedList', users.map(u => u.username));
        ReactSetLoginedList(users);
    }

    console.log('!!!!!!!', loginedList.map(u => u.username));

    return (
        <editHeaderCtx.Provider value={{
            doc: props.doc,

            loginedList,

            setLoginedList,

            addLoginedList(user) {
                console.log(
                    'addLoginedList', user.username);
                setLoginedList( loginedList.concat(user) );
            },

            removeLoginedList(user) {
                console.log(
                    'removeLoginedList', user.username, loginedList.map(u => u.username));
                setLoginedList(
                    loginedList.filter(
                        u => u.username !== user.username));
            },

            msgs,
            pushMsg(component) {
                setMsgs(msgs.concat(component));
            },

            bus
        }}>
            { props.children }
        </editHeaderCtx.Provider>
    )
}


export function EditHeader() {
    const ctx = React.useContext(editHeaderCtx);

    return (
        <div className="edit-header-main">
            <Msgs msgs={ ctx.msgs } />
            <RenderLoginedList list={ ctx.loginedList } />
        </div>
    );
}
