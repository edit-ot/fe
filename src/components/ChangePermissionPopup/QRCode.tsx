import * as React from "react";
import { CreatePopupComponent } from "../../Ctx/Popup";

export type QRCodeProps = CreatePopupComponent<{
    text: string
}>

export function QRCode(props: QRCodeProps) {
    return (
        <div style={{ cursor: 'pointer' }} onClick={ () => props.pop() }>
            {/* QRCode { props.text } */}
            <img src={ `/api/qr/` + encodeURIComponent(props.text) } />
        </div>
    )
}