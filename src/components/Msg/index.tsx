import * as React from "react";
import { popupCtx, popup$, CreatePopupComponent } from "../../Ctx/Popup";

import "./msg.less";
import { ComponentSwitch } from "../ComponentSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getNotification, Msg } from "./msg-api";

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

    React.useEffect(() => {
        getNotification().then(arg => {
            setMsgs(arg);
        });        
    }, []);

    return (
        <div>{
            msgs.length === 0 ? (
                <div className="no-info">暂无通知</div>
            ) : (
                <div>msgs</div>
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
