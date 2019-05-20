import * as React from "react";
import { popupCtx, popup$, CreatePopupComponent } from "../../Ctx/Popup";

import "./msg.less";
import { ComponentSwitch } from "../ComponentSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelopeOpenText, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getAllMsgs, Msg, setReadRemote, NotificationItem, resolveReqRemote, remoteMsgRemote, rejectReqRemote } from "./msg-api";
import cls from "classnames";
import { msgConnect } from "../../utils/WS/MsgConnect";

export type MsgPopupProps = CreatePopupComponent<{}>;



export function MsgPopup(props: MsgPopupProps) {
    return (
        <div className="msg-popup-main">
            <div className="_close" onClick={ props.pop }>
                <FontAwesomeIcon icon={ faTimes } />
            </div>

            <ComponentSwitch configs={[
                {
                    name: <div className="_item">全部通知</div>,
                    inner: <Notification />
                },
                {
                    name: <div className="_item">站内私信</div>,
                    inner: <SiteIM />
                }
            ]} />
        </div>
    )
}

function Notification() {
    const [msgs, setMsgs] = React.useState([] as Msg[]); 

    const init = () => {
        getAllMsgs().then(setMsgs);
    }

    React.useEffect(() => {
        const $$ = () => {
            init();
        }

        msgConnect.socket.on('msg-read-state-change', $$);
        return () => msgConnect.socket.removeListener(
            'msg-read-state-change', $$);
    }, []);

    React.useEffect(init, []);

    const list = msgs.map(m => {
        if (m.type === 'notification') {
            const ni = m.jsonData;
            return (
                <div key={ m.msgId } className={cls('one-notification', {
                    'unread': !m.isRead
                })} onClick={() => {
                    setReadRemote(m).then(init);
                    ni.url && window.open(ni.url);
                }}>
                    <div className="_icon">
                        <FontAwesomeIcon icon={ faEnvelopeOpenText } />
                    </div>
                    <div className="_text">
                        <div className="_noti">消息</div>
                        <div className="_noti-text">{ ni.text }</div>
                    </div>

                    <div className="_req-btns _notification-btns">
                        <button onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            remoteMsgRemote(m.msgId).then(init);
                        }}
                            className="to-resolve">删除</button>
                    </div>
    
                    <div className="_to-right">
                        <FontAwesomeIcon icon={ faChevronRight } />
                    </div>
                </div>
            );
        } else {
            // req
            return (
                <div key={ m.msgId } className={cls('one-notification', {
                    'unread': !m.isRead
                })} onClick={() => {
                    // setReadRemote(m).then(init);
                }}>
                    <div className="_icon">
                        <FontAwesomeIcon icon={ faEnvelopeOpenText } />
                    </div>
                    <div className="_text">
                        <div className="_noti">用户申请</div>
                        <div className="_noti-text">{ m.content }</div>
                    </div>
                        {
                            m.jsonData.state === 'pendding' ? (
                                <div className="_req-btns">
                                    <button
                                        onClick={() => {
                                            resolveReqRemote(m.msgId).then(init);
                                        }}
                                        className="to-resolve">同意</button>

                                    <button
                                        onClick={() => {
                                            rejectReqRemote(m.msgId).then(init);
                                        }}
                                        className="to-reject">拒绝</button>
                                </div>
                            ) : (
                                <div className="_req-btns _finish">
                                    已{ m.jsonData.state === 'resolved' ? '同意' : '拒绝' }

                                    <button
                                        onClick={() => remoteMsgRemote(m.msgId).then(init)}
                                        className="to-reject to-delete">删除此消息</button>
                                </div>
                            )
                        }                   

                    <div className="_to-right">
                        <FontAwesomeIcon icon={ faChevronRight } />
                    </div>
                </div>
            );
        }
    });

    return (
        <div className="notifications">{
            msgs.length === 0 ? (
                <div className="no-info">暂无通知</div>
            ) : (
                <div>
                    { list }
                </div>
            )
        }</div>
    )
}

function SiteIM() {
    return (
        <div>SiteIM</div>
    )
}

export function OpenMsgWindow() {
    popup$.push(MsgPopup, {}, {
        style: { background: 'rgba(0, 0, 0, .5)' }
    });
}
