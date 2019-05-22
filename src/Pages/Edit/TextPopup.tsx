import * as React from "react";

import "./text-popup.less";
import { popup$, CreatePopupComponent } from "../../Ctx/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function showTextPopup(text: React.ReactNode) {
    popup$.push(TextPopup, {
        text
    }, {
        style: { background: 'rgba(0, 0, 0, .5)' }
    });
}

export function TextPopup(props: CreatePopupComponent<{ text: React.ReactNode }>) {
    return (
        <div className="text-popup-main">
            { props.text }
            <div className="_close" onClick={ props.pop }>
                <FontAwesomeIcon icon={ faTimes } />
            </div>
        </div>
    )
}