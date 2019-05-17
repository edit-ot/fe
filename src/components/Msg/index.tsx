import * as React from "react";
import { popupCtx, popup$, CreatePopupComponent } from "../../Ctx/Popup";

import "./msg.less";
import { ComponentSwitch } from "../ComponentSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelopeOpenText, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getNotification, Msg, setReadRemote } from "./msg-api";
import cls from "classnames";

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

type NotificationItem = {
    text: string;
    url?: string;
}

function Notification() {
    const [msgs, setMsgs] = React.useState([] as Msg[]); 

    const init = () => {
        getNotification().then(setMsgs);
    }

    React.useEffect(init, []);

    const list = msgs.map(m => {
        const ni = JSON.parse(m.jsonData || '{}') as NotificationItem;

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

                <div className="_to-right">
                    <FontAwesomeIcon icon={ faChevronRight } />
                </div>
            </div>
        );
    })

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
